using API.Dtos;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class OrderItemUrlResolver : IValueResolver<OrderItem, OrderItemDto, string?>
    {
        private readonly IConfiguration _config;
        public OrderItemUrlResolver(IConfiguration config)
        {
            _config = config;
        }
        public string? Resolve(OrderItem source, OrderItemDto destination, string? destMember, ResolutionContext context)
        {
            if (source.ItemOrdered.PictureUrls != null && source.ItemOrdered.PictureUrls.Count > 0)
            {
                return _config["ApiUrl"] + source.ItemOrdered.PictureUrls[0];
                /*return source.ItemOrdered.PictureUrls
                    .Where(url => !string.IsNullOrEmpty(url))
                    .Select(url => _config["ApiUrl"] + url)
                    .ToArray();*/
            }
            return string.Empty;
        }
    }
}