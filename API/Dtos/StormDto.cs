using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class StormDto
    {
        required public string Id { get; set; }
        required public string Text { get; set; }
    }
}