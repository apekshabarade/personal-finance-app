import { useEffect, useState } from 'react';
import api from '../services/api.js';

const AddIncome = () => {
  const [form, setForm] = useState({
    source: '',
    amount: '',
    category: '',
    date: '',
    notes: '',
  });
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchIncomes = async () => {
    const { data } = await api.get('/api/incomes');
    setItems(data);
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/api/incomes', { ...form, amount: Number(form.amount) });
      setForm({ source: '', amount: '', category: '', date: '', notes: '' });
      setMessage('Income added');
      fetchIncomes();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add income');
    }
  };

  return (
    <div className="card">
      <h2>Add Income</h2>
      <form onSubmit={handleSubmit}>
        <input name="source" placeholder="Source" value={form.source} onChange={handleChange} />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        {message && <p>{message}</p>}
        <button type="submit">Save</button>
      </form>

      <h3 style={{ marginTop: '20px' }}>Your incomes</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((inc) => (
            <tr key={inc._id}>
              <td>{inc.source}</td>
              <td>${inc.amount}</td>
              <td>{inc.category}</td>
              <td>{new Date(inc.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddIncome;

