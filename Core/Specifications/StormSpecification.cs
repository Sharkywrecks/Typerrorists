using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class StormSpecification : BaseSpecification<Storm>
    {
        public StormSpecification(string parentStormId) : base(o => o.ParentId.Equals(parentStormId))
        {
        }
    }
}