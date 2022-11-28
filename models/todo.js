//!定義每筆todo的資料結構

//-require mongoose
const mongoose = require("mongoose");
//- 引入mongoose 提供的Schema模組，大寫表示constructor
const Schema = mongoose.Schema;
//- 建立todolist 的Schema
const todoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
  },
});

//- 將建立好的todoSchema透過mongoose.model匯出供其他檔案引入
module.exports = mongoose.model("Todo", todoSchema);