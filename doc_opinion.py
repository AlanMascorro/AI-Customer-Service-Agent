import google.generativeai as genai
import sys
import json

genai.configure(api_key="AIzaSyCC8oA2UchmPrJzDSyvSGVgitDLjC9wP9U")
model = genai.GenerativeModel("gemini-1.5-flash")
#with open("ill.json", "r", encoding="utf-8") as f:
 #       sick_list = json.load(f)

#sick_joined = " -".join(sick_list)

with open("buf.json", "r", encoding="utf-8") as f:
        question_list = json.load(f)


question_joined = "\n".join(question_list[1:])

response = model.generate_content("Previously I asked you to take a firehouse subs order, this is what was asked: "+question_list[0]+" You then asked the patient the following questions, it has a question then the response is on the following line. \n"+question_joined+" Given the patient survey, state the order details like so: <Sandwich> | <all other details>. Put a $ at the beginning of each listing and terminate each listing with = do not put **")
iterator = iter(response.text.splitlines())
print(response.text + " " + question_joined)
proposed_illness = []
explanation = []

with open("diagnosis.json", "w", encoding="utf-8") as f:
    for line in iterator:
        ill = line.find("$") + 1
        end = line.find("=")
        ill_end = line.find("|")
        if ill > 0:
            proposed_illness.append(line[ill:ill_end])
            proposed_illness.append(line[ill_end+1:end])

   # proposed_illness.append(" ");
   # proposed_illness.append(" ");
    json.dump(proposed_illness, f)
        
for i in proposed_illness:
    print(i)
print(response.text)
