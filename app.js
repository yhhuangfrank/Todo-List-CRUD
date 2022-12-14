//- require related modules
const express = require("express");
const bodyParser = require("body-parser");
//- 引入method-override將form的POST請求改寫
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
//- 引入router
const routes = require("./routes/index");

//- 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//- 連線monggose
require("./config/mongoose");
const app = express();
//- 如果在 Heroku 環境則使用 process.env.PORT
//- 否則為本地環境，使用 3000
const PORT = process.env.PORT || 3000;

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
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost${PORT}`);
});
