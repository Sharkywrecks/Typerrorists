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

        [Cached(600)]
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IReadOnlyList<BrainStormSessionDto>>> GetSessions()
        {
            var user = await _userManager.FindByEmailFromClaimsPrinciple(HttpContext.User);
            if (user == null)
            {
                return NotFound(new ApiResponse(404, "User not found"));
            }
            var spec = new BrainStormSpecification(user.Id);
            var brainStormSession = await _unitOfWork.Repository<BrainStormSession>().GetEntityWithSpec(spec);
            var storms = _mapper.Map<IReadOnlyList<BrainStormSessionDto>>(brainStormSession);
            return Ok(storms);
        }
        
        [Cached(600)]
        [HttpGet("storm/{id}")]
        [Authorize]
        public async Task<ActionResult<IReadOnlyList<StormDto>>> GetStorms(string parentStormId)
        {
            var user = await _userManager.FindByEmailFromClaimsPrinciple(HttpContext.User);
            if (user == null)
            {
                return NotFound(new ApiResponse(404, "User not found"));
            }
            var spec = new StormSpecification(parentStormId);
            var storms = await _unitOfWork.Repository<Storm>().GetEntityWithSpec(spec);
            var stormChildren = _mapper.Map<IReadOnlyList<StormDto>>(storms);
            return Ok(stormChildren);
        }
    }
}