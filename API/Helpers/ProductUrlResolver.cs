using AutoMapper;
using Core.Entities;
using API.Dtos;

namespace API.Helpers
{
    public class ProductUrlResolver : IValueResolver<Product, ProductToReturnDto, ICollection<string>>
    {
        private readonly IConfiguration _config;
        public ProductUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public ICollection<string> Resolve(Product source, ProductToReturnDto destination, ICollection<string> destMember, ResolutionContext context)
        {
            if (source.PictureUrls != null && source.PictureUrls.Count > 0)
            {
                return source.PictureUrls
                    .Where(p => !string.IsNullOrEmpty(p.Url))
                    .Select(p => _config["ApiUrl"] + p.Url)
                    .ToList();
            }
            return new List<string>();
        }
    }
}