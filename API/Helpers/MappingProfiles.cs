using AutoMapper;
using API.Dtos;
using Core.Entities;
using Core.Entities.OrderAggregate;


namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Brand))
                .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Type))
                .ForMember(d => d.PictureUrls, o => o.MapFrom<ProductUrlResolver>())
                .ForMember(d => d.ProductColours, o => o.MapFrom(s => s.ProductColours.Select(x => x.Colour).ToList()))
                .ForMember(d => d.ProductSizes, o => o.MapFrom(s => s.ProductSizes.Select(x => x.Size).ToList()));      
            CreateMap<ProductBrand, ProductBrandDto>();
            CreateMap<Core.Entities.Identity.Address, AddressDto>().ReverseMap();
            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
            CreateMap<AddressDto, Address>();
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price));
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(d => d.ProductColour, o => o.MapFrom(s => s.ItemOrdered.ProductColour))
                .ForMember(d => d.ProductSize, o => o.MapFrom(s => s.ItemOrdered.ProductSize))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<OrderItemUrlResolver>());
        }
    }
}