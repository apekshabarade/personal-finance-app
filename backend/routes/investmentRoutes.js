import express from 'express';
import Investment from '../models/Investment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const investments = await Investment.find({ user: req.user._id }).sort({ date: -1 });
  res.json(investments);
});

router.post('/', async (req, res) => {
  const { assetType, symbol, amountInvested, currentValue, date, notes } = req.body;
  if (!assetType || !amountInvested || !currentValue) {
    return res.status(400).json({ message: 'Asset type and amounts required' });
  }
  const investment = await Investment.create({
    user: req.user._id,
    assetType,
    symbol,
    amountInvested,
    currentValue,
    date,
    notes,
  });
  res.status(201).json(investment);
});

router.put('/:id', async (req, res) => {
  const investment = await Investment.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!investment) {
    return res.status(404).json({ message: 'Investment not found' });
  }
  res.json(investment);
});

router.delete('/:id', async (req, res) => {
  const investment = await Investment.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!investment) {
    return res.status(404).json({ message: 'Investment not found' });
  }
  res.json({ message: 'Deleted' });
});

export default router;

