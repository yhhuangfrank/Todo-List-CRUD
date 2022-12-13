const express = require("express");
const router = express.Router(); //- express 路由器
const Todo = require("../../models/todo");

//! 首頁路由
router.get("/", (req, res) => {
  //- 取出Todo modeal 的所有資料
  Todo.find()
    .lean() //- 把Mongoose的model 物件轉為乾淨的Javascript資料陣列
    .sort({ _id: "asc" }) //- 使用sort將獲取資料排序，此處透過_id進行升冪排序(表示資料建立時序)，降冪排序則使用desc
    .then((todos) => res.render("index", { todos })) //- 將資料傳給index模板
    .catch((error) => console.error(error)); //- 錯誤處理
});

module.exports = router;
