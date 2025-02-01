using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using API.Helpers;
using API.Middleware;
using API.Extensions;
using StackExchange.Redis;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);
/*
builder.WebHost.UseKestrel(options =>
{
    options.ListenAnyIP(5002, listenOptions => listenOptions.UseHttps()); // HTTPS port
});
*/
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddAutoMapper(typeof(MappingProfiles));

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<BrainContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

    builder.Services.AddDbContext<AppIdentityDbContext>(options =>
    {
        options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection"));
    });
}
else
{
    var version = new Version(8, 0, 21);
    builder.Services.AddDbContext<BrainContext>(options =>
        options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), new MySqlServerVersion(version)));

    builder.Services.AddDbContext<AppIdentityDbContext>(options =>
    {
        options.UseMySql(builder.Configuration.GetConnectionString("IdentityConnection"), new MySqlServerVersion(version));
    });
}

builder.Services.AddSingleton<IConnectionMultiplexer>(c =>
{
    var redisConnectionString = builder.Configuration.GetConnectionString("Redis");
    if (string.IsNullOrEmpty(redisConnectionString))
    {
        throw new InvalidOperationException("Redis connection string is not configured.");
    }
    var configuration = ConfigurationOptions.Parse(redisConnectionString, true);
    return ConnectionMultiplexer.Connect(configuration);
});

builder.Services.AddIdentityServices(builder.Configuration);

// Allows me to take requests from client side
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200", "http://localhost:5004");
    });
});

builder.Services.AddControllers();

builder.Services.AddApplicationServices();
builder.Services.AddSwaggerDocumentation();

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.Urls.Add("http://localhost:5004");

// Configure logging
builder.Logging.AddConsole(); // Adds console logging
builder.Logging.AddDebug();   // Adds debug logging

// Use the logger in the application
var loggerFactory = app.Services.GetRequiredService<ILoggerFactory>();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = loggerFactory.CreateLogger<Program>();
    try
    {
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var identityContext = services.GetRequiredService<AppIdentityDbContext>();
        await identityContext.Database.MigrateAsync();
        await AppIdentityDbContextSeed.SeedUsersAsync(userManager); 

        var context = services.GetRequiredService<BrainContext>();
        await context.Database.MigrateAsync();
        await BrainContextSeed.SeedAsync(context, loggerFactory);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerDocumentation();
    app.UseDeveloperExceptionPage();
    app.UseHsts();
}
else
{
    app.UseExceptionHandler("/errors/500");
    app.UseHsts();
}

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("CorsPolicy");

app.UseStatusCodePagesWithReExecute("/errors/{0}");
app.UseHttpsRedirection();
app.UseRouting();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Content")),
    RequestPath = "/content"
});

app.UseAuthentication();
app.UseAuthorization();

// Endpoints
app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

app.Run();
