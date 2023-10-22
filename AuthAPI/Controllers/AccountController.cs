namespace AuthAPI.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;

        public AccountController(
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IMapper mapper
        ){
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserWithTokenDto>> GetCurrentUser() {
            var user = await _userManager.FindByClaimsPrincipleAsync(User);
            var roles = await _userManager.GetRolesAsync(user);
            return _mapper.Map<UserWithTokenDto>(user);
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
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address) {
            AppUser user = await _userManager.FindByClaimsPrincipleWithAddressAsync(User);
            user.Address = _mapper.Map<AddressDto, Address>(address);
            var result = await _userManager.UpdateAsync(user);
            
            if(result.Succeeded) return Ok(_mapper.Map<Address, AddressDto>(user.Address));
            return BadRequest("Problem updating the user");
        }

        [Authorize]
        [HttpPost("getUser")]
        public async Task<ActionResult<UserWithRolesDto>> GetUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound(new ApiResponse(405));
            return _mapper.Map<UserWithRolesDto>(user);
        }

        [Authorize]
        [HttpPost("getUserInRole")]
        public async Task<ActionResult<IEnumerable<UserWithRolesDto>>> UsersInRole(string role)
        {
            if(! await _roleManager.RoleExistsAsync(role)) return NotFound(new ApiResponse(404));
            IEnumerable<AppUser> users = await _userManager.GetUsersInRoleAsync(role);
            return _mapper.Map<IEnumerable<UserWithRolesDto>>(users).ToList();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("assignRole")]
        public async Task<ActionResult<UserWithRolesDto>> AssignRole(UpdateRoleDto updateRoleDto)
        {
            var user = await _userManager.FindByEmailAsync(updateRoleDto.Email);
            if (user == null) return NotFound(new ApiResponse(404));
            if(!await _roleManager.RoleExistsAsync(updateRoleDto.Role)) return NotFound(new ApiResponse(404));
            var userRoles = await _userManager.GetRolesAsync(user);

            if(userRoles.Contains(updateRoleDto.Role)) return NotFound(new ApiResponse(404));
            var result = await _userManager.AddToRoleAsync(user, updateRoleDto.Role);
            if(!result.Succeeded) return NotFound(new ApiResponse(404));
            return _mapper.Map<UserWithRolesDto>(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("removeRole")]
        public async Task<ActionResult<UserWithRolesDto>> RemoveRole(UpdateRoleDto updateRoleDto)
        {
            var user = await _userManager.FindByEmailAsync(updateRoleDto.Email);
            if (user == null) return NotFound(new ApiResponse(404));
            if(!await _roleManager.RoleExistsAsync(updateRoleDto.Role)) return NotFound(new ApiResponse(404));
            var userRoles = await _userManager.GetRolesAsync(user);

            if(!userRoles.Contains(updateRoleDto.Role)) return NotFound(new ApiResponse(404));
            var result = await _userManager.RemoveFromRoleAsync(user, updateRoleDto.Role);
            if(!result.Succeeded) return NotFound(new ApiResponse(404));
            return _mapper.Map<UserWithRolesDto>(user);
        }

        [HttpGet("emailExists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email) 
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<UserWithTokenDto>> Login(LoginDto loginDto) 
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if(!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return _mapper.Map<UserWithTokenDto>(user);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserWithTokenDto>> Register(RegisterDto registerDto)
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
            
            return _mapper.Map<UserWithTokenDto>(user);
        }
    }
}