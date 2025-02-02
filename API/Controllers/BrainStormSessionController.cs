using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;
using Core.Specifications;
using API.Dtos;
using AutoMapper;
using API.Errors;
using API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using API.Extensions;
using System.Diagnostics;

namespace API.Controllers
{
    public class BrainStormSessionController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        
        public BrainStormSessionController(UserManager<AppUser> userManager, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        //[Cached(600)]
        [HttpGet]
        //[Authorize]
        public async Task<ActionResult<IReadOnlyList<BrainStormSessionDto>>> GetSessions()
        {
            /*var user = await _userManager.FindByEmailFromClaimsPrinciple(HttpContext.User);
            if (user == null)
            {
                return NotFound(new ApiResponse(404, "User not found"));
            }*/
            // var spec = new BrainStormSpecification(user.Id);
            var spec = new BrainStormSpecification("1");
            var brainStormSession = await _unitOfWork.Repository<BrainStormSession>().GetEntityWithSpec(spec);
            var storms = _mapper.Map<IReadOnlyList<BrainStormSessionDto>>(brainStormSession);
            return Ok(storms);
        }
        
        //[Cached(600)]
        [HttpGet("storm")]
        //[Authorize]
        public async Task<ActionResult<IReadOnlyList<StormDto>>> GetStorms(string parentStormId)
        {
            /*var user = await _userManager.FindByEmailFromClaimsPrinciple(HttpContext.User);
            if (user == null)
            {
                return NotFound(new ApiResponse(404, "User not found"));
            }*/
            var spec = new StormSpecification(parentStormId);
            var storms = await _unitOfWork.Repository<Storm>().GetEntityWithSpec(spec);
            var stormChildren = _mapper.Map<IReadOnlyList<StormDto>>(storms);
            return Ok(stormChildren);
        }

        [HttpPost("create-storm")]
        //[Authorize]
        public async Task<ActionResult<IReadOnlyList<StormDto>>> GetAiSuggestions(string prompt)
        {
            string context = "1,-1,This is a parent 2,1,This is 1st child 3,1,This is 2nd child 4,2,This is 1st childs grandchild";
            string exclude = "";

        // Prepare process info
        var startInfo = new ProcessStartInfo
        {
            FileName = "python",
            Arguments = $"./Scripts/mindmap.py \"{context}\" \"{prompt}\" \"{exclude}\"",
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            CreateNoWindow = true
        };

        var suggestions = new List<StormDto>();

        using (var process = new Process { StartInfo = startInfo })
            {
                // Start
                process.Start();

                // Read output and errors
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();

                process.WaitForExit();
                Console.WriteLine(output);
                var result = output.Split(",");

                for (int i = 0; i < result.Length; i++)
                {
                    suggestions.Add(new StormDto
                    {
                        Id = Guid.NewGuid().ToString(),
                        Text = result[i]
                    });
                }
            }
            return Ok(suggestions);
        }

        [HttpPost("create-database-schema")]
        //[Authorize]
        public async Task<ActionResult<PhysicalFileResult>> CreateDatabaseSchema(IFormFile image)
        {   
            if (image == null || image.Length == 0)
            {
                return BadRequest(new ApiResponse(400, "No image uploaded"));
            }

            var filePath = Path.Combine("Content/images", "brainstorm.png");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            // Prepare process info
            var startInfo = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"./Scripts/imagetodbschema.py",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true
            };

            var schemaFiles = new List<string>();

            using (var process = new Process { StartInfo = startInfo })
            {
                // Start
                process.Start();

                // Read output and errors
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();

                process.WaitForExit();
                Console.WriteLine(output);
                var result = output.Split(",");

                foreach (var file in result)
                {
                    schemaFiles.Add(file.Trim());
                }
            }

            if (schemaFiles.Count == 2)
            {
                var file1 = Path.Combine("Content/schemas", schemaFiles[0]);
                var file2 = Path.Combine("Content/schemas", schemaFiles[1]);

                var files = new List<PhysicalFileResult>
                {
                    PhysicalFile(file1, "application/octet-stream"),
                    PhysicalFile(file2, "application/octet-stream")
                };

                return Ok(files);
            }
            else
            {
                return BadRequest(new ApiResponse(400, "Schema generation failed"));
            }
        }
    }
}