import { useState } from "react";
import "./App.css";

const MONTHLY_INCOME = 45000;
const MONTHLY_LIMIT = 30000;

export default function App() {
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

  /* ================= CALCULATIONS ================= */
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = MONTHLY_INCOME - totalSpent;
  const limitPercent = Math.min((totalSpent / MONTHLY_LIMIT) * 100, 100);

  const categoryMap = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((e) => e.amount))
      : 0;

  /* ================= ADD EXPENSE ================= */
  const addExpense = () => {
    if (!amount || amount <= 0) return;

    const newExpense = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-IN"),
      category,
      amount: Number(amount),
      payment,
    };

    setExpenses([newExpense, ...expenses]);
    setAmount("");
  };

  return (
    <div className="app">
      {/* ================= SIDEBAR ================= */}
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
            <span>User</span>
          </div>
        </div>

        <button className="logout">Logout</button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="content">
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <p className="subtitle">Home Expense Dashboard</p>

            {/* SUMMARY */}
            <div className="cards">
              <div className="card">
                <h4>Total Income</h4>
                <p>₹{MONTHLY_INCOME}</p>
              </div>
              <div className="card">
                <h4>Total Spent</h4>
                <p>₹{totalSpent}</p>
              </div>
              <div className="card">
                <h4>Remaining</h4>
                <p>₹{remaining}</p>
              </div>
              <div className="card">
                <h4>Highest Expense</h4>
                <p>₹{highestExpense}</p>
              </div>
            </div>

            {/* LIMIT */}
            <div className="limit-box">
              <div className="limit-head">
                <span>Monthly Limit ₹30,000</span>
                <span>{limitPercent.toFixed(0)}%</span>
              </div>
              <div className="limit-bar">
                <div
                  className={`limit-fill ${
                    limitPercent > 90
                      ? "red"
                      : limitPercent > 70
                      ? "yellow"
                      : ""
                  }`}
                  style={{ width: `${limitPercent}%` }}
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

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Food</option>
                <option>Rent</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Other</option>
              </select>

              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Bank</option>
              </select>

              <button onClick={addExpense}>Add Expense</button>
            </div>

            {/* CATEGORY ANALYTICS */}
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
          </>
        )}

        {page === "transactions" && (
          <>
            <h1>Transactions</h1>

            <div className="table">
              <div className="thead">
                <span>Date</span>
                <span>Category</span>
                <span>Payment</span>
                <span>Amount</span>
              </div>

              {expenses.map((e) => (
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
      </main>
    </div>
  );
}
