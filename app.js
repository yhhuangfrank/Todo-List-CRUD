//- require related modules
const express = require(express);
const app = express();
const port = 3000;


//- set

//- set route
app.get("/", (req, res) => {
  res.send(`This page is created by express!!`)
})

//- listen to server
app.listen(port, () => {
  console.log(`Server is running on http://localhost${port}`)
})