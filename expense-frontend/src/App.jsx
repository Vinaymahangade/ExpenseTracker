import { useState } from "react";
import "./App.css";

const MONTHLY_INCOME = 45000;
const MONTHLY_LIMIT = 30000;

export default function App() {
  /* ================= SIMPLE LOGIN (OLD STYLE) ================= */
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (username && password) setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  /* ================= STATE ================= */
  const [page, setPage] = useState("dashboard");

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: new Date().toLocaleDateString("en-IN"),
      category: "Rent",
      amount: 12000,
      payment: "Bank",
    },
    {
      id: 2,
      date: new Date().toLocaleDateString("en-IN"),
      category: "Food",
      amount: 2900,
      payment: "UPI",
    },
  ]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [payment, setPayment] = useState("UPI");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  /* ================= CALCULATIONS ================= */
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = MONTHLY_INCOME - totalSpent;
  const limitPercent = Math.min((totalSpent / MONTHLY_LIMIT) * 100, 100);
  const highestExpense = expenses.length
    ? Math.max(...expenses.map((e) => e.amount))
    : 0;

  /* ================= ADD / UPDATE ================= */
  const addOrUpdateExpense = () => {
    if (!amount) return;

    if (editId) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editId
            ? { ...e, amount: Number(amount), category, payment }
            : e
        )
      );
      setEditId(null);
    } else {
      setExpenses((prev) => [
        {
          id: Date.now(),
          date: new Date().toLocaleDateString("en-IN"),
          category,
          amount: Number(amount),
          payment,
        },
        ...prev,
      ]);
    }

    setAmount("");
  };

  const editExpense = (e) => {
    setEditId(e.id);
    setAmount(e.amount);
    setCategory(e.category);
    setPayment(e.payment);
    setPage("dashboard");
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  /* ================= FILTER ================= */
  const filteredExpenses = expenses.filter((e) => {
    const searchMatch =
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.payment.toLowerCase().includes(search.toLowerCase()) ||
      e.amount.toString().includes(search);

    const categoryMatch =
      filterCategory === "All" || e.category === filterCategory;

    return searchMatch && categoryMatch;
  });

  /* ================= LOGIN UI ================= */
  if (!loggedIn) {
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
          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Expense AI</h2>

        <button
          className={page === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={page === "transactions" ? "active" : ""}
          onClick={() => setPage("transactions")}
        >
          Transactions
        </button>

        <div className="user">
          <div className="avatar">V</div>
          <div>
            <strong>Vinay</strong>
            <div>User</div>
          </div>
        </div>

        <button className="logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="content">
        {/* ================= DASHBOARD ================= */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div className="cards">
              <div className="card"><h4>Total Income</h4><p>₹{MONTHLY_INCOME}</p></div>
              <div className="card"><h4>Total Spent</h4><p>₹{totalSpent}</p></div>
              <div className="card"><h4>Remaining</h4><p>₹{remaining}</p></div>
              <div className="card"><h4>Highest Expense</h4><p>₹{highestExpense}</p></div>
            </div>

            <div className="limit-box">
              <div className="limit-head">
                <span>Monthly Limit ₹30,000</span>
                <span>{limitPercent.toFixed(0)}%</span>
              </div>
              <div className="limit-bar">
                <div
                  className={`limit-fill ${
                    limitPercent > 90 ? "red" : limitPercent > 70 ? "yellow" : ""
                  }`}
                  style={{ width: `${limitPercent}%` }}
                />
              </div>
            </div>

            {/* ADD EXPENSE */}
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
                <option>Bills</option>
                <option>Shopping</option>
              </select>
              <select value={payment} onChange={(e) => setPayment(e.target.value)}>
                <option>UPI</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Bank</option>
              </select>
              <button onClick={addOrUpdateExpense}>
                {editId ? "Update" : "Add Expense"}
              </button>
            </div>

            {/* ✅ THIS FIXES YOUR DASHBOARD PROBLEM */}
            <div className="table">
              <h3>Recent Expenses</h3>
              {expenses.slice(0, 5).map((e) => (
                <div className="trow" key={e.id}>
                  <span>{e.date}</span>
                  <span>{e.category}</span>
                  <span>{e.payment}</span>
                  <strong>₹{e.amount}</strong>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= TRANSACTIONS ================= */}
        {page === "transactions" && (
          <>
            <h1>Transactions</h1>

            <div className="filters">
              <input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All</option>
                <option>Food</option>
                <option>Rent</option>
                <option>Travel</option>
                <option>Bills</option>
              </select>
            </div>

            <div className="table">
              <div className="thead">
                <span>Date</span>
                <span>Category</span>
                <span>Payment</span>
                <span>Amount</span>
                <span>Action</span>
              </div>

              {filteredExpenses.map((e) => (
                <div className="trow" key={e.id}>
                  <span>{e.date}</span>
                  <span>{e.category}</span>
                  <span>{e.payment}</span>
                  <strong>₹{e.amount}</strong>
                  <div className="actions">
                    <button onClick={() => editExpense(e)}>✏️</button>
                    <button style={{ color: "red" }} onClick={() => deleteExpense(e.id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
