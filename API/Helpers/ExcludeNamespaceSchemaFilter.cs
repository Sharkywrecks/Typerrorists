using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.OpenApi.Models;
using NJsonSchema.Generation;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace API.Helpers
{
    public class ExcludeNamespaceSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (context.Type.Namespace != null && context.Type.Namespace.StartsWith("API.AdminDto."))
            {
                schema.Properties.Clear();
            }
        }
    }
}