namespace AuthAPI.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenProvider _tokenProvider;
        private readonly IMapper _mapper;

        public AccountController(
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            ITokenProvider tokenProvider,
            IMapper mapper
        ){
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _tokenProvider = tokenProvider;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser() {
            var user = await _userManager.FindByClaimsPrincipleAsync(User);

            return new UserDto() {
                Email = user.Email,
                Token = _tokenProvider.CreateToken(user, await _userManager.GetRolesAsync(user)),
                DisplayName = user.DisplayName
            };
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email) 
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress() 
        {
            AppUser user = await _userManager.FindByClaimsPrincipleWithAddressAsync(User);
            return _mapper.Map<Address, AddressDto>(user.Address);
        }

        [Authorize]
        [HttpPut("address")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address) {
            AppUser user = await _userManager.FindByClaimsPrincipleWithAddressAsync(User);
            user.Address = _mapper.Map<AddressDto, Address>(address);
            var result = await _userManager.UpdateAsync(user);
            
            if(result.Succeeded) return Ok(_mapper.Map<Address, AddressDto>(user.Address));
            return BadRequest("Problem updating the user");
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("AssignRole")]
        public async Task<ActionResult<UserDto>> AssignRole(AssignRoleDto assignRoleDto)
        {
            var user = await _userManager.FindByEmailAsync(assignRoleDto.Email);
            if (user == null) return NotFound(new ApiResponse(404));
            if(!await _roleManager.RoleExistsAsync(assignRoleDto.Role)) return NotFound(new ApiResponse(404));
            var userRoles = await _userManager.GetRolesAsync(user);

            if(userRoles.Contains(assignRoleDto.Role)) return NotFound(new ApiResponse(404));
            var result = await _userManager.AddToRoleAsync(user, assignRoleDto.Role);
            if(!result.Succeeded) return NotFound(new ApiResponse(404));

            return new UserDto() {
                Email = user.Email,
                //Token = _tokenProvider.CreateToken(user, await _userManager.GetRolesAsync(user)),
                DisplayName = user.DisplayName
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) 
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if(!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return new UserDto() {
                Email = user.Email,
                Token = _tokenProvider.CreateToken(user, await _userManager.GetRolesAsync(user)),
                DisplayName = user.DisplayName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) 
        {
            if(CheckEmailExistsAsync(registerDto.Email).Result.Value) {
                return new BadRequestObjectResult(new ApiValidationErrorResponse{
                    Errors = new [] {
                        "Email address is in use"
                    }
                });
            }

            var user = new AppUser() {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            
            if(result.Succeeded) {
                var identityResult = await _userManager.AddToRoleAsync(user, Role.User);
                
                if(!identityResult.Succeeded) {
                    return BadRequest(new ApiResponse(400));
                }
            }
            else {
                return BadRequest(new ApiResponse(400));
            }

            return new UserDto {
                DisplayName = user.DisplayName,
                Token = _tokenProvider.CreateToken(user, await _userManager.GetRolesAsync(user)),
                Email = user.Email
            };
        }
    }
}