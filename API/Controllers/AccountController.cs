using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Mvc;
using API.Dtos;
using API.Errors;
using API.Extensions;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IPostDataService _postDataService;
        private readonly IConfiguration _config;

        public AccountController(UserManager<AppUser> userManager, 
        SignInManager<AppUser> signInManager, 
        ITokenService tokenService,
        IPostDataService postDataService,
        IConfiguration config,
        IMapper mapper)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _mapper = mapper;
            // Test part
            _postDataService = postDataService;
            _config = config;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailFromClaimsPrinciple(HttpContext.User);

            if (user == null) return Unauthorized(new ApiResponse(401));

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email ?? "Missing Email",
                Token = await _tokenService.CreateToken(user)
            };
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email ?? "Missing Email",
                Token = await _tokenService.CreateToken(user)
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse{Errors = new []{"Email address is in use"}});
            }
            
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(new ApiResponse(400));
            await _userManager.AddToRolesAsync(user, new [] {"User"});

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = await _tokenService.CreateToken(user)
            };
        }
        
        // TODO: Remove the below code after testing
        [HttpPost("email-test")]
        public async Task<ActionResult> EmailTest([FromBody] EmailRequestDto emailRequest)
        {
            var url = _config["EmailServerUrl"]; // Retrieve the URL from the configuration
            if (string.IsNullOrEmpty(url))
            {
                return BadRequest("Email server URL is not configured.");
            }

            var response = await _postDataService.PostDataAsync(url, emailRequest);

            return Ok(response);
        }
    }
}