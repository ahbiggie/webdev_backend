import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;


// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
   // Render the index.ejs template
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  const numOfNameLetters = req.body.fName.length + req.body.lName.length;
  res.render("index.ejs", { nameLetters: numOfNameLetters });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
