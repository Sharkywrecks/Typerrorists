using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class BrainStormSpecification : BaseSpecification<BrainStormSession>
    {
        public BrainStormSpecification(string userId) : base(o => o.UserId.Equals(userId))
        {
            AddInclude(o => o.Storms);
        }

        public BrainStormSpecification(string userId, string BrainStormId) : base(o => o.Id.Equals(BrainStormId) && o.UserId.Equals(userId))
        {
            AddInclude(o => o.Storms);
        }
    }
}