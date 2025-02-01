using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using CsvHelper;
using CsvHelper.Configuration;

namespace Infrastructure.Data.SeedData
{
    public class CsvToListConverter
    {
        public static async Task<List<T>> ConvertCsvToListAsync<T>(string csvFilePath)
        {
            using (var reader = new StreamReader(csvFilePath))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                PrepareHeaderForMatch = args => args.Header.ToLower(),
                MissingFieldFound = null,
                HeaderValidated = null
            }))
            {
                var records = await Task.Run(() => csv.GetRecords<T>().ToList());
                return records;
            }
        }
    }
}