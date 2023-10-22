namespace AuthAPI.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Address, AddressDto>().ReverseMap();

            CreateMap<AppUser, UserWithRolesDto>()
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Email))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.DisplayName))
                .ForMember(d => d.Roles, o => o.MapFrom<UserRolesResolver>());
                
            CreateMap<AppUser, UserWithTokenDto>()
                .ForMember(d => d.Email, o => o.MapFrom(s => s.Email))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.DisplayName))
                .ForMember(d => d.Roles, o => o.MapFrom<UserRolesResolver>())
                .ForMember(d => d.Token, o => o.MapFrom<UserJwtResolver>());
        }
    }
}