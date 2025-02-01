using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class BrainStormSessionDto
    {
        required public string Id { get; set; }
        required public string SessionName { get; set; }
    }
}