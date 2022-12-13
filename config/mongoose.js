const mongoose = require("mongoose");
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

//- 匯出db讓其他檔案使用
module.exports = db