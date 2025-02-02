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
        
        [Cached(600)]
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

        [Cached(600)]
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
            Arguments = $"mindmap.py \"{context}\" \"{prompt}\" \"{exclude}\"",
            WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Scripts"),
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

        [Cached(600)]
        [HttpPost("create-database-schema")]
        public async Task<ActionResult<IReadOnlyList<string>>> CreateDatabaseSchema(IFormFile image)
        {   
            if (image == null || image.Length == 0)
            {
                return BadRequest(new ApiResponse(400, "No image uploaded"));
            }

            var filePath = Path.Combine("Content", "images", "brainstorm.png");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Run the Python script
            var startInfo = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"imagetodbschema.py",
                WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Scripts"),
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
            }

            // Generate file URLs instead of returning PhysicalFileResult
            var fileUrls = new List<string>();

            fileUrls.Add($"{Request.Scheme}://{Request.Host}/Content/schemas/database_schema.png");

            return Ok(fileUrls);
        }

        //[Cached(600)]
        [HttpPost("create-database-csv")]
        public async Task<ActionResult<IReadOnlyList<string>>> CreateDatabaseCsv(IFormFile image)
        {   
            if (image == null || image.Length == 0)
            {
                return BadRequest(new ApiResponse(400, "No image uploaded"));
            }

            var filePath = Path.Combine("Content", "images", image.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var fileName = image.FileName;
            // Run the Python script
            var startInfo = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"imgtocsv.py \"{fileName}\"",
                WorkingDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Scripts"),
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
            }

            // Generate file URLs instead of returning PhysicalFileResult
            var fileUrls = new List<string>();

            fileUrls.Add($"{Request.Scheme}://{Request.Host}/Content/csv/output.csv");

            return Ok(fileUrls);
        }
    }
}