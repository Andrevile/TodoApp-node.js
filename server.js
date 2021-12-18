const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const nunjucks = require("nunjucks");

let db;
let board_id = 0;
MongoClient.connect((err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("todoapp");

  app.listen(8080, () => {
    console.log("listening on 8080");
  });
});
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/views" + "/index.html");
  res.render("index");
});

app.get("/write", (req, res) => {
  console.log(req);
  res.render("write");
});

app.post("/add", (req, res) => {
  res.send("전송완료");
  db.collection("counter").findOne({ name: "게시물갯수" }, (err, result) => {
    let PostNum = result.totalPost;
    db.collection("post").insertOne(
      { _id: PostNum + 1, title: req.body.title, date: req.body.date },
      (err, result) => {
        console.log("저장완료");
        db.collection("counter").updateOne(
          { name: "게시물갯수" },
          { $inc: { totalPost: 1 } },
          (err) => {
            if (err) {
              return console.log(err);
            }
          }
        );
      }
    );
  });

  console.log(req.body.title);
});

app.get("/list", (req, res) => {
  const data = db
    .collection("post")
    .find()
    .toArray((err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.render("list", { posts: result });
    }); //데이터베이스 모두 가져오기
});

app.delete("/delete", (req, res) => {
  req.body._id = parseInt(req.body._id);
  console.log(req.body);
  db.collection("post").deleteOne(req.body, (err, result) => {
    console.log("삭제완료");
    res.status(200).send({ message: "성공했습니다." });
  });
});

app.get("/detail/:id", (req, res) => {
  //: 은 뒤에 어떤 문자열을 입력한 경로
  console.log(req.params.id);
  console.log("gi");
  req.params.id = parseInt(req.params.id);
  db.collection("post").findOne({ _id: req.params.id }, (err, result) => {
    console.log(result);
    if (err) {
    }
    res.render("detail", { data: result });
  });
});
