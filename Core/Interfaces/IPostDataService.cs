namespace Core.Interfaces
{
    public interface IPostDataService
    {
        Task<HttpResponseMessage> PostDataAsync(string url, object data);
    }
}