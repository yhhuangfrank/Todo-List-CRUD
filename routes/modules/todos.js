const express = require("express");
const router = express.Router();
const Todo = require("../../models/todo");

//- 有關/todo的route整理在此
//* 新增頁面讓使用者新增新的todo
router.get("/new", (req, res) => {
  return res.render("new");
});
//* 填寫完新todo的表單後，送往db更新
router.post("/", (req, res) => {
  const name = req.body.name;
  return Todo.create({ name })
    .then(() => res.redirect("/")) //-新增到db後導回首頁
    .catch((err) => console.log(err));
});

//* 導向todo detail頁面
router.get("/:id", (req, res) => {
  const id = req.params.id;
  // !從db中Todo物件找尋對應id的todo，並傳給detail頁面渲染
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((err) => console.log(err));
});

//* 導向修改todo內容頁面
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((err) => console.log(err));
});

//* 收到edit表單修改請求 (使用PUT請求)
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, isDone } = req.body; //- 獲取req.body的name, isDone值
  return Todo.findById(id)
    .then((todo) => {
      //-將新的name更新到todo.name
      todo.name = name;
      todo.isDone = isDone === "on"; //- 如果checked會得到on，將todo.isDone設為true, 反之則false
      return todo.save(); //-將更新好的todo儲存至db
    })
    .then(() => res.redirect(`/todos/${id}`)) //-更新成功則重新導向對應id的detail頁面
    .catch((err) => console.log(err)); //-更新失敗的話則報錯誤
});

//* 刪除todo請求
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .then((todo) => todo.remove())
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

module.exports = router;
