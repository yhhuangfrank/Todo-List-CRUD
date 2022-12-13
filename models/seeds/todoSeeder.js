//- 載入先前設定的Todo models
const Todo = require("../todo");

//- 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//! 設定資料庫連線 (並將exports出來的db接取)
const db = require("../../config/mongoose")

//* 連線成功
db.once("open", () => {
  //- 連線成功後發送新增資料要求,新增10筆資料
  for (let i = 0; i < 10; i += 1) {
    Todo.create({ name: `name-${i}` });
  }
  console.log("done");
});
