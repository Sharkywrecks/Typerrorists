using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public ApiResponse(int statusCode, string? message = null)
        {
            StatusCode = statusCode;
            Message = message ?? GetDefaultMessageForStatusCode(statusCode);
        }
        private string GetDefaultMessageForStatusCode(int statusCode)
        {
            return statusCode switch
            {
                400 => "Bad Request. The server could not understand the request due to invalid syntax.",
                401 => "Unauthorized. The client must authenticate itself to get the requested response.",
                404 => "Not Found. The server can not find the requested resource.",
                500 => "Internal Server Error. The server has encountered a situation it doesn't know how to handle.",
                _ => "An unexpected error occurred."
            };
        }
    }
}