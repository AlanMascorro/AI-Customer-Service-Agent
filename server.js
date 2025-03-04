const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());




function display(questions, flag){

  if (flag == 1){
app.get("/get-messages", (req, res) => {
  fs.readFile(questions, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading messages." });
    }

    // Convert file contents to an array (each line is a JSON object)
     let messages;
        try {
            messages = data.trim() ? JSON.parse(data) : [];
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            return res.status(500).json({ error: "Invalid JSON format in messages.json" });
        }

    res.json(messages); // Send messages to Vue
    console.log("there was nothing "+messages[0])

  });

});

}else if (flag == 2){
app.get("/get-res", (req, res) => {
  setTimeout(async () => {
  fs.readFile(questions, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading messages." });
    }

    // Convert file contents to an array (each line is a JSON object)
     let messages;
        try {
            messages = data.trim() ? JSON.parse(data) : [];
        } catch (parseError) {
            console.error("JSON parse error:", parseError);
            return res.status(500).json({ error: "Invalid JSON format in messages.json" });
        }

    res.json(messages); // Send messages to Vue
    console.log("your problem: "+messages[0])


  });
   }, 2000); 

});

}
}

app.post("/save-message", (req, res) => {
  const { type, message, script } = req.body;
  console.log(req.body);
  const userText = req.body.message; // Get text from Vue.js
  const stype = req.body.type;
  console.log(stype);
  if (!userText) {
    return res.status(400).json({ error: "Text is required" });
  }

  // Create JSON object


  const data = { message: userText };

  // Write to JSON file
  scr = ""
  cat = ""
  fl = 1

  if (stype == "script"){

    scr = "docbot.py"
    cat = "buf.json"
    fl = 1

 }else{


  fs.writeFile("buf.json", JSON.stringify(stype, null, 2), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Failed to save");
        }
        res.send("Array saved!");
    });

    scr = "doc_opinion.py"
    cat = "diagnosis.json"
    fl = 2
 }
    
    const { spawn } = require("child_process");
    const pythonProcess = spawn("python", [scr, message]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    console.log("the "+output+" and "+scr);

    pythonProcess.on("close", () => {
      res.send({ result: output.trim() });
    });

    display(cat, fl)

    

      

});


app.listen(3000, () => console.log("Server running on port 3000"));
