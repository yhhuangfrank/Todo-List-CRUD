//- require related modules
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

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

//- set route
app.get("/", (req, res) => {
  res.send(`This page is created by express!!`);
});

//- listen to server
app.listen(port, () => {
  console.log(`Server is running on http://localhost${port}`);
});
