import sys
import anthropic
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("ANTHROPIC_API_KEY")

client = anthropic.Anthropic(api_key=API_KEY)


def stillIncludesExclusion(prompt_output, exclude):

    new_message = f"""Does this list include any of the following exclusions 
    Exclusions: {exclude}
    List: {prompt_output}
    Please only return "True" if it includes an exclusion or "False" if it does not. Do not include other text"""

    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=8192,
            messages=[{"role": "user", "content": [
                {"type": "text", "text": new_message}
            ]}]
        )
        output = message.content[0].text
    except anthropic.AuthenticationError:
        print("❌ Authentication Error: Invalid API Key. Please check your Anthropic API key.")
        exit()
    except anthropic.BadRequestError as e:
        print(f"❌ API Request Error: {e}")
        exit()
    # print("check Output: "+output == "True")
    return output == "True"

def getAiSuggestions(context, prompt, exclude= "No Exclusions added"):

    prompt = f"""Act as a Brainstorming AI Expert
    Given the context of the brainstorm we have so far: 
    {context}
    And the current node we want suggestions from: 
    {prompt}
    Please give me 4 suggestions for that node in a csv format and only the csv format. No text
    Please do not give me any of the following items in the suggestions: {exclude}
    DO NOT PUT HYPHENS IN BETWEEN WORDS AND SPELL IT AS IF IT APPEARS ON A SEARCH ENGINE LIKE GOOGLE
    DO NOT TRY TO GIVE ME THE EXCLUDED VALUES IN A DIFFERENT FORMAT , I NEED NEW SUGGESTIONS RELEVANT TO THE CONTEXT"""

    # print(prompt)

        

    # use the API to get suggestions
    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=8192,
            messages=[
                {"role": "user", "content": [
                    {"type": "text", "text": prompt}
                ]}
            ]
        )
        text = message.content[0].text
        # print(text, stillIncludesExclusion(text, exclude))
        includes_exclusion = stillIncludesExclusion(text, exclude)
        while includes_exclusion:
            print("My exclusions are: ", exclude)
            print("Exclusion found in suggestions. Trying again", includes_exclusion)
            text = getAiSuggestions(context, prompt, exclude)
            includes_exclusion = stillIncludesExclusion(text, exclude)
        return text
    except anthropic.AuthenticationError:
        print("❌ Authentication Error: Invalid API Key. Please check your Anthropic API key.")
        exit()
    except anthropic.BadRequestError as e:
        print(f"❌ API Request Error: {e}")
        exit()

# test the function
# context = """storms-id,parent-id,text
# 1,-1,A BMW
# 2,1,Engine
# 3,1,Interior
# 4,2,Pistons
# """
# prompt = "Engine"

# output = getAiSuggestions(context, prompt)

# print(output)

# get just text from the output



if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <context> <prompt>")
        sys.exit(1)

    context = sys.argv[1]
    prompt = sys.argv[2]
    
    if len(sys.argv) == 4:
        exclude = sys.argv[3]
        output = getAiSuggestions(context, prompt, exclude)
    else:
        output = getAiSuggestions(context, prompt)
    print(output)