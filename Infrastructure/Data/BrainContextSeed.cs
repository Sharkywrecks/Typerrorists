using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Infrastructure.Data.SeedData;

namespace Infrastructure.Data
{
    public class BrainContextSeed
    {
        public static async Task SeedAsync(BrainContext context, ILoggerFactory loggerFactory)
        {
            var logger = loggerFactory.CreateLogger<BrainContextSeed>();
            try
            {
                var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                path = Path.Combine(path, "Data", "SeedData");

                // Seed Types
                if (!context.BrainStormSessions.Any())
                {
                    await SeedEntityAsync<BrainStormSession>(context, path, "brainStormSession.csv", logger);
                }

                // Seed Brands
                if (!context.Storms.Any())
                {
                    await SeedEntityAsync<Storm>(context, path, "storm.csv", logger);
                }

                if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred during seeding the database");
            }
        }

        private static async Task SeedEntityAsync<TEntity>(BrainContext context, string path, string fileName, ILogger logger) where TEntity : class
        {
            var csvFilePath = Path.Combine(path, fileName);
            var entities = await CsvToListConverter.ConvertCsvToListAsync<TEntity>(csvFilePath);
            try {
                if (entities != null)
                {
                    foreach (var entity in entities)
                    {
                        switch (entity)
                        {
                            case BrainStormSession brainStormSession:
                                if (entity is BrainStormSession session)
                                {
                                    brainStormSession = session;
                                }
                                // productColour.Product = await GetEntityAsync(context.Products, productColour.ProductId);
                                break;
                            case Storm storm:
                                if (entity is Storm strm)
                                {
                                    storm = strm;
                                }
                                // productSize.Product = await GetEntityAsync(context.Products, productSize.ProductId);
                                break;
                        }
                        context.Set<TEntity>().Add(entity);
                    }
                }
                else
                {
                    logger.LogWarning($"No data found for {typeof(TEntity).Name} in {csvFilePath}");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"An error occurred while seeding {typeof(TEntity).Name}");
            }
        }

        private static async Task<TEntity> GetEntityAsync<TEntity>(DbSet<TEntity> dbSet, string id) where TEntity : BaseEntity
        {
            // First, try to find the entity in the in-memory cache (Local)
            var entity = dbSet.Local.FirstOrDefault(e => e.Id == id);

            // If it's not found in Local, perform a database lookup
            if (entity == null)
            {
                entity = await dbSet.FirstOrDefaultAsync(e => e.Id == id);
            }

            if (entity == null)
            {
                throw new InvalidOperationException($"Entity of type {typeof(TEntity).Name} with Id {id} not found.");
            }

            return entity;
        }
    }
}
