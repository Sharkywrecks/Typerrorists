using System.Text;
using System.Text.Json;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class PostDataService: IPostDataService
    {
        private readonly HttpClient _httpClient;
        public PostDataService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        
        public async Task<HttpResponseMessage> PostDataAsync(string url, object data)
        {
            var jsonData = JsonSerializer.Serialize(data);
            var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);

            response.EnsureSuccessStatusCode();

            return response;
        }
    }
}