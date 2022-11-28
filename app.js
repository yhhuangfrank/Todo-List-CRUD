//- require related modules
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
//* 引入todo model
const Todo = require("./models/todo");

//- 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//- set database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//* 取得資料庫連線狀態
const db = mongoose.connection;
//* 連線異常時
db.on("error", () => {
  console.log(`mongodb connect error!!`);
});
//* 連線成功
db.once("open", () => {
  console.log(`mongodb connected!!`);
});

//- set view engine (handlebars)，設定extname(副檔名為".hbs")
app.engine("hbs", exphbs({ defaultLayouts: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

//- bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));

//- set route
app.get("/", (req, res) => {
  //- 取出Todo modeal 的所有資料
  Todo.find()
    .lean() //- 把Mongoose的model 物件轉為乾淨的Javascript資料陣列
    .then((todos) => res.render("index", { todos })) //- 將資料傳給index模板
    .catch((error) => console.error(error)); //- 錯誤處理
});

//* 新增頁面讓使用者新增新的todo
app.get("/todos/new", (req, res) => {
  return res.render("new");
});
//* 填寫完新todo的表單後，送往db更新
app.post("/todos", (req, res) => {
  const name = req.body.name;
  return Todo.create({ name })
    .then(() => res.redirect("/")) //-新增到db後導回首頁
    .catch((err) => console.log(err));
});

//* 導向todo detail頁面
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  // !從db中Todo物件找尋對應id的todo，並傳給detail頁面渲染
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((err) => console.log(err));
});

//* 導向修改todo內容頁面
app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((err) => console.log(err));
});

//* 收到edit表單POST請求
app.post("/todos/:id/edit", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  return Todo.findById(id)
    .then((todo) => {
      //-將新的name更新到todo.name
      todo.name = name;
      return todo.save(); //-將更新好的todo儲存至db
    })
    .then(() => res.redirect(`/todos/${id}`)) //-更新成功則重新導向對應id的detail頁面
    .catch((err) => console.log(err)); //-更新失敗的話則報錯誤
});

//* 刪除todo請求
app.post("/todos/:id/delete", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .then((todo) => todo.remove())
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

//- listen to server
app.listen(port, () => {
  console.log(`Server is running on http://localhost${port}`);
});
