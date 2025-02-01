namespace API.Errors
{
    public class ApiException : ApiResponse
    {
        public ApiException(int statusCode, string message = "Unknown error", string details = "Unknown error") : base(statusCode, message ?? "Unknown error")
        {
            Details = details;
        }

        public string Details { get; set; }
    }
}