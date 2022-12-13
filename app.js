//- require related modules
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
//- 引入method-override將form的POST請求改寫
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
//- 引入router
const routes = require("./routes/index");

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
//- method-override middleware
app.use(methodOverride("_method"));

//- set route
app.use(routes);

//- listen to server
app.listen(port, () => {
  console.log(`Server is running on http://localhost${port}`);
});
