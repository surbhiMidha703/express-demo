const config = require("config");
const express = require("express");
const log = require("./middleware/logger");
const helmet = require("helmet");
const morgan = require("morgan");
const startupDebug = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const courses = require("./routes/courses");
const home = require("./routes/home");

const app = express();

app.set("view engine", "pug"); //
app.set("views", "./views");

//configuration
console.log(`Application name ${config.get("name")}`);
console.log(`Host name=>  ${config.get("mail.host")}`);
// console.log(`password=>  ${config.get("mail.password")}`);

app.use("/", home);
app.use("/api/courses", courses);
app.use(express.json()); //express.json returns middleware, app.use uses that middleware in the request processing pipeline
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebug("morgan enabled");
}

app.use(helmet());

app.use(log); // custom middleware

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...!!`);
});
