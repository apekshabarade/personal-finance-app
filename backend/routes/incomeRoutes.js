import express from 'express';
import Income from '../models/Income.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// List incomes
router.get('/', async (req, res) => {
  const incomes = await Income.find({ user: req.user._id }).sort({ date: -1 });
  res.json(incomes);
});

// Create income
router.post('/', async (req, res) => {
  const { source, amount, category, date, notes } = req.body;
  if (!source || !amount) {
    return res.status(400).json({ message: 'Source and amount required' });
  }
  const income = await Income.create({
    user: req.user._id,
    source,
    amount,
    category,
    date,
    notes,
  });
  res.status(201).json(income);
});

// Update income
router.put('/:id', async (req, res) => {
  const income = await Income.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!income) {
    return res.status(404).json({ message: 'Income not found' });
  }
  res.json(income);
});

// Delete income
router.delete('/:id', async (req, res) => {
  const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!income) {
    return res.status(404).json({ message: 'Income not found' });
  }
  res.json({ message: 'Deleted' });
});

export default router;

