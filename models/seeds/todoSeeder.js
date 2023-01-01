//- require related models
const Todo = require("../todo");
const User = require("../user");
//- require related module
const bcrypt = require("bcryptjs");

//- 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//! 設定資料庫連線 (並將exports出來的db接取)
const db = require("../../config/mongoose");

//- 設定SEED_USER資料
const SEED_USER = {
  name: "root",
  email: "root@example.com",
  password: "12345678",
};

//* 連線成功
db.once("open", () => {
  //- 連線成功後發送新增資料要求,新增10筆資料
  return bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(SEED_USER.password, salt))
    .then((hash) =>
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash,
      })
    )
    .then((user) => {
      const userId = user._id;
      //- 利用Array.from建立空陣列並填入Promise.all中
      return Promise.all(
        Array.from({ length: 10 }, (value, index) =>
          Todo.create({ name: `name-${index}`, userId })
        )
      );
    })
    .then(() => {
      console.log("done");
      process.exit(); //- 結束todoSeeder
    })
    .catch((err) => console.log(err));
});
