import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assetType: { type: String, required: true },
    symbol: { type: String },
    amountInvested: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

const Investment = mongoose.model('Investment', investmentSchema);

export default Investment;

