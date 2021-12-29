const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const nunjucks = require("nunjucks");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
require("dotenv").config();
let db;
let board_id = 0;
MongoClient.connect(process.env.DB_URL, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("todoapp");

  app.listen(process.env.PORT, () => {
    console.log("listening on 8080");
  });
});
const app = express();

app.use(
  session({ secret: "secretCode", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
app.use(express.static("public"));

app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/views" + "/index.html");
  res.render("index");
});

app.get("/write", (req, res) => {
  // console.log(req);
  res.render("write");
});

app.post("/add", (req, res) => {
  console.log(req.body);
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
    // res.send("hell");
    // res.render("list");
    res.redirect("/list");
  });

  // console.log(req.body.title);
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
    res.status(200).send({ message: "성공했습니다." }); //200 : 성공, 400 : 고객잘못 요청 실패, 500: 서버문제 요청 실패
  });
});

app.get("/detail/:id", (req, res) => {
  //: 은 뒤에 어떤 문자열을 입력한 경로
  // console.log(req.params.id);
  req.params.id = parseInt(req.params.id);
  db.collection("post").findOne({ _id: req.params.id }, (err, result) => {
    console.log(result);
    if (err) {
    }
    res.render("detail", { data: result });
  });
});

app
  .route("/edit/:id")
  .get(function (req, res) {
    req.params.id = parseInt(req.params.id);
    db.collection("post").findOne({ _id: req.params.id }, (err, result) => {
      if (err) {
        alert(err);
      } else {
        console.log(result);
      }
      res.render("edit", { data: result });
    });
  })
  .post(function (req, res) {
    console.log(req.body);
    db.collection("post").updateOne(
      { _id: parseInt(req.body._id) },
      { $set: { title: req.body.title, date: req.body.date } },
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("success");
        res.redirect("/list");
      }
    );
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

passport.use(
  new LocalStrategy(
    {
      usernameField: "id", //form의 name = "id"
      passwordField: "pw", //form의 name = "pw"
      session: true,
      passReqToCallback: false,
    },
    function (inputID, inputPW, done) {
      db.collection("login").findOne({ id: inputID }, function (err, result) {
        if (err) {
          return done(err);
        }
        if (!result) {
          return done(null, false, { message: "존재하지 않는 아이디입니다." });
        }
        if (inputPW == result.pw) {
          return done(null, result);
        } else {
          return done(null, false, { message: "비밀번호가 틀렸습니다." });
        }
      });
    }
  )
);
