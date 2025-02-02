import os
import csv
import anthropic
import base64
from PIL import Image, UnidentifiedImageError
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("ANTHROPIC_API_KEY")
client = anthropic.Anthropic(api_key=API_KEY)

def encode_image(image_path):
    """Encodes an image to Base64 and detects its actual media type."""
    try:
        with open(image_path, "rb") as img_file:
            image_data = img_file.read()
            encoded_image = base64.b64encode(image_data).decode("utf-8")

        try:
            with Image.open(image_path) as img:
                format_detected = img.format.lower()
                media_type = f"image/{format_detected}"
        except UnidentifiedImageError:
            print(f"❌ Error: Unable to identify image format for '{image_path}'. Ensure it's a valid PNG or JPG.")
            exit()

        return {"type": "base64", "media_type": media_type, "data": encoded_image}
    except FileNotFoundError:
        print(f"❌ Error: Image '{image_path}' not found.")
        exit()

def mindmap_to_csv(mindmap_text, csv_filename):
    """
    Sends mindmap text to Claude for transformation into CSV format.
    The returned lines are expected to match:
    storms-id,parent-id,text
    """
    prompt = (
        f"You are a Brainstorming AI Expert. Convert the following mindmap into CSV lines:\n"
        f"{anthropic.HUMAN_PROMPT} \n"
        f"{mindmap_text}\n"
        f"{anthropic.AI_PROMPT}\n"
        f"DO NOT INCLUDE ANY HEADERS OR FOOTERS OR OTHER TEXT IN THE OUTPUT"
    )

    encoded_image = encode_image("mindmap.png")

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
    
    # print(message.content[0].text)
    csv_lines = message.content[0].text
    with open(csv_filename, "w") as csv_file:
        csv_file.write(csv_lines)


if __name__ == "__main__":
    mindmap_input = """
storms-id,parent-id,text
1,-1,This is a parent
2,1,This is 1st child
3,1,This is 2nd child
4,2,This is 1st childs grandchild
    """

    mindmap_to_csv(mindmap_input, "output.csv")