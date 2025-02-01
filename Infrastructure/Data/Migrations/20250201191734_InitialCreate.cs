using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BrainStormSessions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ParentId = table.Column<string>(type: "TEXT", nullable: false),
                    SessionName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BrainStormSessions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StormChildren",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false),
                    ParentId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ChildId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StormChildren", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Storms",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false),
                    ParentId = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Text = table.Column<string>(type: "TEXT", nullable: false),
                    BrainStormSessionId = table.Column<string>(type: "varchar(255)", nullable: true),
                    StormId = table.Column<string>(type: "varchar(255)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Storms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Storms_BrainStormSessions_BrainStormSessionId",
                        column: x => x.BrainStormSessionId,
                        principalTable: "BrainStormSessions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Storms_Storms_StormId",
                        column: x => x.StormId,
                        principalTable: "Storms",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Storms_BrainStormSessionId",
                table: "Storms",
                column: "BrainStormSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Storms_StormId",
                table: "Storms",
                column: "StormId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StormChildren");

            migrationBuilder.DropTable(
                name: "Storms");

            migrationBuilder.DropTable(
                name: "BrainStormSessions");
        }
    }
}
