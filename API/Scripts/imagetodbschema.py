import anthropic
import base64
import re
import time
from graphviz import Digraph
from PIL import Image, UnidentifiedImageError
import os
from dotenv import load_dotenv
load_dotenv()

# Replace with your actual API key
API_KEY = os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Anthropic(api_key=API_KEY)

class SchemaVisualizer:
    def __init__(self, image_path):
        self.image_path = image_path

    def encode_image(self):
        """Encodes an image to Base64 and detects its media type."""
        try:
            with open(self.image_path, "rb") as img_file:
                image_data = img_file.read()
                encoded_image = base64.b64encode(image_data).decode("utf-8")
            try:
                with Image.open(self.image_path) as img:
                    format_detected = img.format.lower()
                    media_type = f"image/{format_detected}"
            except UnidentifiedImageError:
                print(f"❌ Error: Unable to identify image format for '{self.image_path}'.")
                exit()
            return {"type": "base64", "media_type": media_type, "data": encoded_image}
        except FileNotFoundError:
            print(f"❌ Error: Image '{self.image_path}' not found.")
            exit()

    def call_claude_api(self, schema_type):
        """
        Sends an image along with a detailed prompt to Claude and returns the response.
        The prompt instructs Claude to generate a comprehensive relational database schema.
        """
        encoded_image = self.encode_image()
        prompt = (
            "Analyze this brainstorm diagram and generate a detailed relational database schema. "
            "Please include a comprehensive set of tables with descriptive names, complete column definitions "
            "with appropriate SQL data types (e.g., INT, VARCHAR, DATE, FLOAT) and constraints (PRIMARY KEY, "
            "FOREIGN KEY, NOT NULL), and sample data insertion statements where relevant. Ensure that all "
            "relevant aspects of the diagram are captured and use as many tables as necessary to represent the domain thoroughly. "
            "Output the result as a valid SQL code block enclosed within triple backticks (```sql ... ```)."
        )
        try:
            message = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=8192,
                messages=[
                    {"role": "user", "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image", "source": encoded_image}
                    ]}
                ]
            )
            return message.content
        except Exception as e:
            print(f"❌ API Request Error: {e}")
            exit()

    def parse_response(self, response):
        """
        Parses Claude's response and extracts the SQL code block.
        Assumes the response is a list of objects with a 'text' attribute, or a string.
        The SQL code should be enclosed between triple backticks (with an optional 'sql' hint).
        """
        if isinstance(response, list):
            text_response = " ".join([block.text for block in response if hasattr(block, "text")])
        else:
            text_response = str(response)

        # Look for a SQL code block delimited by triple backticks (with an optional "sql" marker)
        sql_match = re.search(r"```sql\s*(.*?)\s*```", text_response, re.DOTALL | re.IGNORECASE)
        if sql_match:
            sql_code = sql_match.group(1)
            return "database", sql_code

        # Fallback: if no explicit code block, look for SQL keywords.
        if "CREATE TABLE" in text_response.upper():
            return "database", text_response

        return "unknown", None

    def extract_tables_and_relationships(self, sql_text):
        """
        Parses the SQL text to extract table definitions and foreign key relationships.
        Returns:
          - tables: A dictionary mapping table names to lists of column definitions.
          - relationships: A list of tuples (table, referenced_table) for each foreign key relationship.
        """
        tables = {}
        relationships = []
        # Match CREATE TABLE blocks (case-insensitive)
        matches = re.findall(r"CREATE TABLE\s+(\w+)\s*\((.*?)\);", sql_text, re.DOTALL | re.IGNORECASE)
        for table, content in matches:
            # Split the column definitions on commas (ignoring commas within parentheses)
            columns = re.split(r",\s*(?![^(]*\))", content)
            columns = [col.strip() for col in columns if col.strip()]
            tables[table] = columns
            # Find any foreign key references in the column definitions
            for col in columns:
                match_fk = re.search(r"REFERENCES\s+(\w+)", col, re.IGNORECASE)
                if match_fk:
                    ref_table = match_fk.group(1)
                    relationships.append((table, ref_table))
        return tables, relationships

    def visualize_db_schema_digraph(self, sql_text):
        """
        Creates a directed graph (digraph) of the database schema using Graphviz.
        Each table is shown as a node (with its column definitions) and each foreign key relationship as an edge.
        The graph is rendered and saved as 'database_schema.png'.
        Note: Each node is set with shape="none" to remove the default border (i.e. no circle).
        """
        tables, relationships = self.extract_tables_and_relationships(sql_text)
        
        dot = Digraph(comment="Database Schema", format="png")
        
        # Create a node for each table using an HTML-like label to show the table name and columns.
        for table, columns in tables.items():
            label = f"""<
<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0">
  <TR><TD BGCOLOR="lightblue"><B>{table}</B></TD></TR>
"""
            for col in columns:
                label += f"  <TR><TD ALIGN='LEFT'>{col}</TD></TR>\n"
            label += "</TABLE>>"
            # Use shape="none" to avoid the default node outline (circle/ellipse)
            dot.node(table, label=label, shape="none")
        
        # Add an edge for each foreign key relationship.
        for src, dst in relationships:
            dot.edge(src, dst)
        
        output_filename = "database_schema"
        output_path = f"../Content/schemas/{output_filename}"
        dot.render(output_path, view=True)
        print(f"✅ Database schema digraph saved as '{output_filename}.png'.")

    def run(self, schema_type):
        """
        Main function:
          - Calls Claude to generate a schema from the image.
          - Parses the response to extract the SQL code.
          - Visualizes the schema as a directed graph.
        """
        response = self.call_claude_api(schema_type)
        detected_schema_type, parsed_data = self.parse_response(response)
        if detected_schema_type == "database":
            self.visualize_db_schema_digraph(parsed_data)
        else:
            print("❌ Unable to parse a database schema from Claude's response.")

if __name__ == "__main__":
    # Create an instance of SchemaVisualizer with your image file.
    visualizer = SchemaVisualizer("../Content/images/brainstorm.png")
    # Run the visualizer for a "database" schema.
    visualizer.run("database")
