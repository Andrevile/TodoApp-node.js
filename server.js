const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/write", (req, res) => {
  res.sendFile(__dirname + "/write.html");
});

app.post("/add", (req, res) => {
  res.send("전송완료");
  console.log(req.body.title);
});
app.listen(8080, () => {
  console.log("listening on 8080");
});
