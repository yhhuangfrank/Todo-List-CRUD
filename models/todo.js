//!定義每筆todo的資料結構

//-require mongoose
const mongoose = require("mongoose");
//- 引入mongoose 提供的Schema模組，大寫表示constructor
const Schema = mongoose.Schema;
//* 也可簡寫為 const {Schema} = mongoose
//- 建立todolist 的Schema
const todoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  //- 新增userId代表個別的使用者
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true, //- 建立索引方便查找
    required: true,
  }
});

//- 將建立好的todoSchema透過mongoose.model匯出供其他檔案引入
module.exports = mongoose.model("Todo", todoSchema);
