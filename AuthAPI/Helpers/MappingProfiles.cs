namespace AuthAPI.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles() 
        {
            CreateMap<Address, AddressDto>().ReverseMap();
        }
    }
}