//! 設定資料庫連線
const mongoose = require("mongoose");
//- 載入先前設定的Todo models
const Todo = require("../todo");

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
  //- 連線成功後發送新增資料要求,新增10筆資料
  for (let i = 0; i < 10; i += 1) {
    Todo.create({ name: `name-${i}` });
  }
  console.log("done");
});
