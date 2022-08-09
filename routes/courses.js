const express = require("express");

const appRouter = express.Router();

const courses = [
  { id: 1, name: "maths" },
  { id: 2, name: "english" },
];

appRouter.get("/", (req, res) => {
  // get courses from db
  res.send(`courses ${JSON.stringify(courses)}`);
});

// defining query param:
appRouter.get("/:id", (req, res) => {
  //   res.send(req.query);
  //   res.send(req.params);

  //   const course = courses.find((ele) => ele.id === parseInt(req.params.id));
  const course = findCourse(req.params.id);
  !course ? res.status(404).send("Course not found!") : res.send(course);
});

//post a course and validate incoming name in the request
appRouter.post("/", (req, res) => {
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
appRouter.put("/:id", (req, res) => {
  console.log("ALL COURSES => ", courses);
  //   const course = courses.find((ele) => ele.id === parseInt(req.params.id));
  const course = findCourse(req.params.id);
  if (!course) return res.status(404).send("course not found!");
});

// DELETE request
appRouter.delete("/:id", (req, res) => {
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

module.exports = appRouter;
