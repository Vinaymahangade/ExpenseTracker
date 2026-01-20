import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080";
const MONTHLY_LIMIT = 10000;

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOGIN ================= */
  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD EXPENSES ================= */
  const loadExpenses = async () => {
    const res = await fetch(`${API}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (token) loadExpenses();
  }, [token]);

  /* ================= ADD EXPENSE ================= */
  const addExpense = async () => {
    if (!amount || amount <= 0) return;

    const expense = {
      amount: Number(amount),
      category,
      note,
      paymentMode,
      date: new Date().toISOString().slice(0, 10),
    };

    const res = await fetch(`${API}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    });

    const saved = await res.json();
    setExpenses((prev) => [saved, ...prev]);
    setAmount("");
    setNote("");
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setExpenses([]);
  };

  /* ================= LOGIN UI ================= */
  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Expense AI</h1>
          <p>Home Expense Report</p>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>
            {loading ? "Signing in..." : "Login"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  /* ================= ANALYTICS ================= */
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = Math.max(MONTHLY_LIMIT - totalSpent, 0);
  const percent = Math.min((totalSpent / MONTHLY_LIMIT) * 100, 100);

  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const topCategory =
    Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const highestExpense =
    expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0;

  /* ================= DASHBOARD ================= */
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Expense AI</h2>

        <div className="user-box">
          <div className="avatar">V</div>
          <div>
            <strong>Vinay Mahangade</strong>
            <div>User</div>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <h1>Dashboard</h1>
        <p className="subtitle">Home Expense Dashboard</p>

        {/* SUMMARY */}
        <div className="cards">
          <div className="card">
            <h4>Total Spent</h4>
            <p>₹{totalSpent}</p>
          </div>
          <div className="card">
            <h4>Remaining</h4>
            <p>₹{remaining}</p>
          </div>
          <div className="card">
            <h4>Top Category</h4>
            <p>{topCategory}</p>
          </div>
          <div className="card">
            <h4>Highest Expense</h4>
            <p>₹{highestExpense}</p>
          </div>
        </div>

        {/* LIMIT */}
        <div className="limit-box">
          <div className="limit-head">
            <span>Monthly Limit ₹10,000</span>
            <span>{percent.toFixed(0)}%</span>
          </div>
          <div className="limit-bar">
            <div
              className={`limit-fill ${
                percent > 90 ? "red" : percent > 70 ? "yellow" : ""
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* ADD */}
        <div className="add-row">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Rent</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>

          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option>UPI</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Bank</option>
          </select>

          <input
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button onClick={addExpense}>Add</button>
        </div>

        {/* ANALYTICS */}
        <div className="analytics">
          <h3>Category Analytics</h3>
          {Object.entries(categoryMap).map(([cat, val]) => (
            <div className="bar" key={cat}>
              <span>{cat}</span>
              <div className="progress">
                <div
                  className="fill"
                  style={{
                    width: `${(val / totalSpent) * 100 || 0}%`,
                  }}
                />
              </div>
              <span>₹{val}</span>
            </div>
          ))}
        </div>

        {/* RECENT */}
        <div className="list">
          <h3>Recent Expenses</h3>
          {expenses.map((e) => (
            <div className="row" key={e.id}>
              <span>{e.date}</span>
              <span>{e.category}</span>
              <span>{e.paymentMode}</span>
              <strong>₹{e.amount}</strong>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
