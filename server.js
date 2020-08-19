const express = require("express");

const app = express(); // create express app
const port = 5000;
app.get("/", (req, res) => {
  res.send("This is from express.js");
});

// start express server on port 5000
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});