import { useEffect, useMemo, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          api.get('/api/incomes'),
          api.get('/api/expenses'),
        ]);
        setIncomes(incomeRes.data);
        setExpenses(expenseRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const expenseByCategory = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const key = e.category || 'Uncategorized';
      map[key] = (map[key] || 0) + e.amount;
    });
    return map;
  }, [expenses]);

  const monthlyTrend = useMemo(() => {
    const months = {};
    const addEntry = (date, amount, type) => {
      const d = new Date(date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) {
        months[key] = { income: 0, expense: 0 };
      }
      months[key][type] += amount;
    };
    incomes.forEach((i) => addEntry(i.date, i.amount, 'income'));
    expenses.forEach((e) => addEntry(e.date, e.amount, 'expense'));
    const sortedKeys = Object.keys(months).sort();
    return {
      labels: sortedKeys.map((k) => {
        const [year, month] = k.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      income: sortedKeys.map((k) => months[k].income),
      expense: sortedKeys.map((k) => months[k].expense),
      savings: sortedKeys.map((k) => months[k].income - months[k].expense),
    };
  }, [incomes, expenses]);

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : 0;

  const topCategories = useMemo(() => {
    return Object.entries(expenseByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [expenseByCategory]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-state">
        <p style={{ color: '#ff4444' }}>{error}</p>
      </div>
    );
  }

  const chartColors = {
    income: '#10b981',
    expense: '#ef4444',
    savings: '#3b82f6',
    pie: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'],
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>📊 Financial Analytics</h1>
        <p className="analytics-subtitle">Insights into your financial patterns</p>
      </div>
      {/* 🚨 ALERT IF EXPENSE > INCOME */}
{totalExpense > totalIncome && (
  <div
    style={{
      backgroundColor: "#ff4d4d",
      color: "white",
      padding: "14px 18px",
      borderRadius: "12px",
      marginBottom: "20px",
      fontWeight: "bold",
      boxShadow: "0 4px 10px rgba(255,0,0,0.3)",
      display: "inline-block"
    }}
  >
    ⚠ Overspending Alert: Your total expenses are higher than your total income!
  </div>
)}


      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <span className="summary-label">Total Income</span>
            <span className="summary-value">${totalIncome.toFixed(2)}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">💸</div>
          <div className="summary-content">
            <span className="summary-label">Total Expense</span>
            <span className="summary-value">${totalExpense.toFixed(2)}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">💵</div>
          <div className="summary-content">
            <span className="summary-label">Total Savings</span>
            <span className={`summary-value ${totalSavings >= 0 ? 'positive' : 'negative'}`}>
              ${totalSavings.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <span className="summary-label">Savings Rate</span>
            <span className={`summary-value ${savingsRate >= 0 ? 'positive' : 'negative'}`}>
              {savingsRate}%
            </span>
          </div>
        </div>
      </div>

      <div className="analytics-charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>📊 Monthly Income vs Expense</h3>
            <p className="chart-description">Track your income and expenses over time</p>
          </div>
          <div className="chart-wrapper">
            <Bar
              data={{
                labels: monthlyTrend.labels,
                datasets: [
                  {
                    label: 'Income',
                    data: monthlyTrend.income,
                    backgroundColor: chartColors.income,
                    borderRadius: 6,
                  },
                  {
                    label: 'Expense',
                    data: monthlyTrend.expense,
                    backgroundColor: chartColors.expense,
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      padding: 15,
                      font: { size: 12, weight: '500' },
                    },
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return '$' + value.toFixed(0);
                      },
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
              height={300}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>🥧 Expense by Category</h3>
            <p className="chart-description">See where your money goes</p>
          </div>
          <div className="chart-wrapper pie-wrapper">
            {Object.keys(expenseByCategory).length > 0 ? (
              <Pie
                data={{
                  labels: Object.keys(expenseByCategory),
                  datasets: [
                    {
                      data: Object.values(expenseByCategory),
                      backgroundColor: chartColors.pie,
                      borderWidth: 2,
                      borderColor: '#fff',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 15,
                        font: { size: 12, weight: '500' },
                        generateLabels: function (chart) {
                          const data = chart.data;
                          if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                              const value = data.datasets[0].data[i];
                              const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                              const percentage = ((value / total) * 100).toFixed(1);
                              return {
                                text: `${label}: $${value.toFixed(2)} (${percentage}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i,
                              };
                            });
                          }
                          return [];
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
                height={300}
              />
            ) : (
              <div className="empty-chart">
                <p>No expense data available</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Savings Trend</h3>
            <p className="chart-description">Monthly savings over time</p>
          </div>
          <div className="chart-wrapper">
            <Line
              data={{
                labels: monthlyTrend.labels,
                datasets: [
                  {
                    label: 'Savings',
                    data: monthlyTrend.savings,
                    borderColor: chartColors.savings,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.parsed.y;
                        return `Savings: $${value.toFixed(2)}`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    ticks: {
                      callback: function (value) {
                        return '$' + value.toFixed(0);
                      },
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
              height={300}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>🏆 Top Expense Categories</h3>
            <p className="chart-description">Your highest spending categories</p>
          </div>
          <div className="category-list">
            {topCategories.length > 0 ? (
              topCategories.map(([category, amount], index) => {
                const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0;
                return (
                  <div key={category} className="category-item">
                    <div className="category-rank">#{index + 1}</div>
                    <div className="category-details">
                      <span className="category-name">{category}</span>
                      <div className="category-bar-wrapper">
                        <div
  className="category-bar"
  style={{
    width: `${percentage}%`,
    backgroundColor:
      amount > totalIncome
        ? "#ff4d4d" // 🔴 red when category > total income
        : chartColors.pie[index % chartColors.pie.length],
    position: "relative",
  }}
>
  {amount > totalIncome && (
    <span
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "white",
        fontWeight: "bold",
        fontSize: "12px",
      }}
    >
      ⚠ Overspending
    </span>
  )}
</div>
                      </div>
                    </div>
                    <div className="category-amount">
                      ${amount.toFixed(2)}
                      <span className="category-percentage">({percentage}%)</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-message">No expense categories available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

