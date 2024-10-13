const express = require('express');
const app = express();
const Task = require('./models/task');

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/',(req,res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});






// Create: Adds new data (e.g., creating a new user or task).
    // Example: POST /tasks adds a new task to your task manager.
// Read: Retrieves existing data (e.g., getting a list of users or tasks).
    // Example: GET /tasks fetches all tasks from the database.
// Update: Modifies existing data (e.g., updating a user’s information or changing a task’s details).
    // Example: PUT /tasks/:id updates a specific task with new information.
// Delete: Removes existing data (e.g., deleting a task or user).
    // Example: DELETE /tasks/:id removes a specific task from the database.
let tasks = [];

// Create Task
app.post('/tasks', async (req, res) => {
    try {
      const task = await Task.create(req.body);
      res.status(201).send(task);
    } 
    catch (error) {
      res.status(400).send(error.message);
    }
});
  
  // Get All Tasks
  app.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.findAll();
      res.status(200).json(tasks);
    } 
    catch (error) {
      res.status(500).send(error.message);
    }
});
  
  // Update Task
  app.put('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (task) {
        await task.update(req.body);
        res.status(200).send(task);
      } 
      else {
        res.status(404).send('Task not found');
      }
    } 
    catch (error) {
      res.status(400).send(error.message);
    }
});
  
  // Delete Task
  app.delete('/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (task) {
        await task.destroy();
        res.status(200).send(`Task with id ${req.params.id} deleted`);
      } 
      else {
        res.status(404).send('Task not found');
      }
    } 
    catch (error) {
      res.status(500).send(error.message);
    }
});

