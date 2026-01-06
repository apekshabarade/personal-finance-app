import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, token, logout } = useAuth(); // ✅ USE CONTEXT TOKEN
  const navigate = useNavigate();

  const [summary, setSummary] = useState({ incomes: [], expenses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 🔐 BLOCK DASHBOARD WITHOUT TOKEN
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          api.get("/api/incomes"),
          api.get("/api/expenses"),
        ]);

        setSummary({
          incomes: incomeRes.data || [],
          expenses: expenseRes.data || [],
        });
      } catch (err) {
        // 🚪 AUTO LOGOUT ON INVALID TOKEN
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Failed to load data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, logout]); // ✅ CORRECT DEPENDENCIES

  const totalIncome = summary.incomes.reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );

  const totalExpense = summary.expenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  const balance = totalIncome - totalExpense;

  const expensePercentage =
    totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          Welcome{user?.email ? `, ${user.email}` : ""} 👋
        </h1>
        <p className="dashboard-subtitle">
          Here's your financial overview
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <h3>Total Income: ₹{totalIncome.toFixed(2)}</h3>
          <h3>Total Expense: ₹{totalExpense.toFixed(2)}</h3>
          <h3>Balance: ₹{balance.toFixed(2)}</h3>
          <p>{expensePercentage}% of income spent</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
