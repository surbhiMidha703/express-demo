const Joi = require("joi");

const express = require("express");
const log = require("./logger");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(express.json()); //express.json returns middleware, app.use uses that middleware in the request processing pipeline
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

app.use(helmet());

app.use(log); // custom middleware
const courses = [
  { id: 1, name: "maths" },
  { id: 2, name: "english" },
];

app.get("/", (req, res) => {
  res.send("hello world!!!");
});

app.get("/api/courses", (req, res) => {
  // get courses from db
  res.send(`courses ${JSON.stringify(courses)}`);
});

// defining query param:
app.get("/api/courses/:id", (req, res) => {
  //   res.send(req.query);
  //   res.send(req.params);

  //   const course = courses.find((ele) => ele.id === parseInt(req.params.id));
  const course = findCourse(req.params.id);
  !course ? res.status(404).send("Course not found!") : res.send(course);
});

//post a course and validate incoming name in the request
app.post("/api/courses", (req, res) => {
  const { error, value } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: value.name,
  };

  courses.push(course);
  res.send(course);
});

//Put - update a course
app.put("/api/course/:id", (req, res) => {
  console.log("ALL COURSES => ", courses);
  //   const course = courses.find((ele) => ele.id === parseInt(req.params.id));
  const course = findCourse(req.params.id);
  if (!course) return res.status(404).send("course not found!");
});

// DELETE request
app.delete("/api/course/:id", (req, res) => {
  const course = findCourse(req.params.id);
  if (!course) return res.status(404).send("course not found!");

  courses.splice(courses.indexOf(course), 1);
  res.send(courses);
});

//utilities
const validateCourse = (courseNameObj) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(courseNameObj);
};

const findCourse = (reqID) => {
  return courses.find((ele) => ele.id === parseInt(reqID));
};

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...!!`);
});
