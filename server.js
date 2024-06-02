
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const folderPath = path.join(__dirname, 'files');

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to create a text file with the current timestamp and additional data from the request body
app.post('/create-file', (req, res) => {
  const now = new Date();
  const timestamp = now.toISOString();
  const filename = `${now.toISOString().replace(/[:.]/g, '-')}.txt`;
  const filePath = path.join(folderPath, filename);
  const content = `Timestamp: ${timestamp}\n\n` + JSON.stringify(req.body, null, 2);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error writing file' });
    }
    res.status(201).json({
      message: `File ${filename} created`,
      timestamp: timestamp
    });
  });
});

// Endpoint to retrieve all text files in the folder
app.get('/files', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading directory' });
    }
    res.status(200).json(files);
  });
});

app.get("/",(req,res)=>{
  res.send("Server looking good");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

