import express from 'express';
import Expense from '../models/Expense.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
  res.json(expenses);
});

router.post('/', async (req, res) => {
  const { title, amount, category, date, notes } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ message: 'Title and amount required' });
  }
  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    category,
    date,
    notes,
  });
  res.status(201).json(expense);
});

router.put('/:id', async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  res.json(expense);
});

router.delete('/:id', async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  res.json({ message: 'Deleted' });
});

export default router;

