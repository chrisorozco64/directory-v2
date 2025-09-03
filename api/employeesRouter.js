import express from "express";
import employees from "../db/employees.js";
const router = express.Router();
export default router;

router
  .route("/")
  .get((req, res) => {
    res.status(200).send(employees);
  })
  .post((req, res) => {
    if (!req.body) {
      return res.status(400).send("Request body is required");
    }
    const { name } = req.body;
    if (!name || name.length === 0) {
      return res.status(400).send("Name is required");
    }
    const lastEmployee = employees[employees.length - 1];
    let id = lastEmployee.id + 1;
    const obj = {
      id,
      name,
    };
    employees.push(obj);
    res.status(201).send(obj);
  });

// Note: this middleware has to come first! Otherwise, Express will treat
// "random" as the argument to the `id` parameter of /employees/:id.
router.route("/random").get((req, res) => {
  const randomIndex = Math.floor(Math.random() * employees.length);
  res.send(employees[randomIndex]);
});

router.route("/:id").get((req, res) => {
  const { id } = req.params;

  // req.params are always strings, so we need to convert `id` into a number
  // before we can use it to find the employee
  const employee = employees.find((e) => e.id === +id);

  if (!employee) {
    return res.status(404).send("Employee not found");
  }

  res.send(employee);
});
