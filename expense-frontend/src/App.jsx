import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:8080";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔁 Check token on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // 🔐 LOGIN
  const login = async () => {
    setMessage("");
    if (!username || !password) {
      setMessage("Username & password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      localStorage.setItem("token", data.token);

      setIsLoggedIn(true);
      setMessage("Login successful ✅");
    } catch {
      setMessage("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setReport(null);
    setUsername("");
    setPassword("");
    setMessage("");
  };

  // 📊 LOAD REPORT
  const loadReport = async () => {
    setMessage("");
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/analytics/monthly`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setReport(data);
    } catch {
      setMessage("Failed to load report ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>AI Expense Tracker</h2>

        {!isLoggedIn && (
          <>
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

            <button onClick={login} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        )}

        {isLoggedIn && (
          <>
            <div className="actions">
              <button onClick={loadReport} disabled={loading}>
                {loading ? "Loading..." : "📊 Load Monthly Report"}
              </button>

              <button className="logout" onClick={logout}>
                🚪 Logout
              </button>
            </div>

            {report ? (
              <div className="report">
                <div className="stat">
                  <span>Total Spent</span>
                  <h3>₹{report.totalSpent}</h3>
                </div>

                <div className="stat">
                  <span>Savings</span>
                  <h3 className={report.savings < 0 ? "danger" : "success"}>
                    ₹{report.savings}
                  </h3>
                </div>

                <div className="advice">
                  <h4>AI Advice</h4>
                  <p>{report.advice}</p>
                </div>
              </div>
            ) : (
              <div className="empty">
                <p>No expenses recorded yet 🚀</p>
                <p>Start tracking to see insights.</p>
              </div>
            )}
          </>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;
