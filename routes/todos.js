const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all todos for a user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add new todo
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const newTodo = new Todo({ text, user: req.user.id });
    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { text, completed } = req.body;
    
    let todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ msg: 'Todo not found' });
    
    // Check user owns the todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: { text, completed } },
      { new: true }
    );
    
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ msg: 'Todo not found' });
    
    // Check user owns the todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await Todo.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;