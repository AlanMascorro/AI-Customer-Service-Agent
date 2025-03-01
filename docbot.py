import google.generativeai as genai
import sys
import json

genai.configure(api_key="Your Key")

model = genai.GenerativeModel("gemini-1.5-flash")

#symptoms = "I have sore throat I feel cold all the time and I have a runny nose"
sick_list = []
question_list = []
symptoms = sys.argv[1]
question_list.append(symptoms) 
response = model.generate_content("You are part of a system that takes orders from customers at a firehouse subs. this is what the customer ordered "+symptoms+" you are then going to ask the customers a series of formatted questions1. If they didn't specify ask whether or not they want white bread or wheat bread2. If they didn't specify ask whether or not they want a combo 3. If they didn't specify ask if they want a pickle with the order format the questions to have at the beginning a ; character and have them each in their own line so that I can parse the questions from your response.")
iterator = iter(response.text.splitlines())
num_question = 0
print(response.text)
with open("buf.json", "w", encoding="utf-8") as f:
    for line in iterator:
        #ill = line.find("$") + 1
        start = line.find(";") + 1
        end = line.find("?", start)
     #   if ill > 0:
      #      sick_list.append(line[ill:])    
        if start > 0:
            question_list.append(line[start:end])
            num_question += 1
    json.dump(question_list, f)


# Save `sick_list` to a JSON file
#with open("ill.json", "w", encoding="utf-8") as f:
 #       json.dump(sick_list, f)

