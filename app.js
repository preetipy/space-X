const express = require("express")
const app = express()

// use the express-static middleware
app.use(express.static("public"));
app.set('view engine','html')

// define the first route
app.get("/", function (req, res) {
  res.render("index")
})

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));