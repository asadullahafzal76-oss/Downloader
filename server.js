const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/yt-download", (req, res) => {
  const { url, format } = req.body;
  if (!url) return res.status(400).send("No URL provided");

  const fileName = `download.${format === "mp3" ? "mp3" : "mp4"}`;
  const filePath = path.join(__dirname, fileName);

  const command =
    format === "mp3"
      ? `yt-dlp -x --audio-format mp3 -o "${filePath}" "${url}"`
      : `yt-dlp -f best -o "${filePath}" "${url}"`;

  exec(command, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Download failed");
    }
    res.download(filePath, fileName, () => fs.unlinkSync(filePath));
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
