import { useEffect, useState } from 'react';
import api from '../services/api.js';

const AddExpense = () => {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    notes: '',
  });
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchExpenses = async () => {
    const { data } = await api.get('/api/expenses');
    setItems(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/api/expenses', { ...form, amount: Number(form.amount) });
      setForm({ title: '', amount: '', category: '', date: '', notes: '' });
      setMessage('Expense added');
      fetchExpenses();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add expense');
    }
  };

  return (
    <div className="card">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
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

      <h3 style={{ marginTop: '20px' }}>Your expenses</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {items.map((exp) => (
            <tr key={exp._id}>
              <td>{exp.title}</td>
              <td>${exp.amount}</td>
              <td>{exp.category}</td>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddExpense;

