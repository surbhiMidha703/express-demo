const express = require("express");
const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  res.render("index", { title: "my express app", message: "hello" });
});

module.exports = homeRouter;
