const Joi = require("joi");
const express = require("express");

const app = express();

app.use(express.json()); //express.json returns middleware, app.use uses that middleware in the request processing pipeline

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

  const course = courses.find((ele) => ele.id === parseInt(req.params.id));

  !course ? res.status(404).send("Course not found!") : res.send(course);
});

//post a course and validate incoming name in the request
app.post("/api/courses", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  const { value, error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    // name: req.body.name,
    name: value.name,
  };

  courses.push(course);
  console.log("courses=> ", courses);
  res.send(course);
});

//Put - update a course
app.put("/api/course/:id", (req, res) => {
  //   const reqId = req.params.id;
  //   const reqName = req.body.name;

  console.log("ALL COURSES => ", courses);
  const course = courses.find((ele) => ele.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("course not found!");
    return;
  }

  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error, value } = schema.validate(req.body);

  console.log("error on name=> ", error);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(courses);
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...!!`);
});
