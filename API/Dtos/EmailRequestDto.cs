using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class EmailRequestDto
    {
        required public string To { get; set; }
        required public string Subject { get; set; }
        required public string Message { get; set; }
    }
}