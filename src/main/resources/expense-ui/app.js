const API = "http://localhost:8080/api";

/*  PAGE ROUTING */

function showPage(page) {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("dashboard-page").classList.add("hidden");
    document.getElementById("transactions-page").classList.add("hidden");

    if (page === "dashboard") {
        document.getElementById("dashboard-page").classList.remove("hidden");
        loadDashboard();
    }

    if (page === "transactions") {
        document.getElementById("transactions-page").classList.remove("hidden");
        loadExpenses();
    }
}

/* AUTH  */

function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    fetch(API + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
        .then(res => {
            if (!res.ok) throw new Error("Login failed");
            return res.json();
        })
        .then(data => {
            localStorage.setItem("token", data.token);
            showPage("dashboard");
        })
        .catch(() => {
            document.getElementById("login-error").innerText =
                "Invalid username or password";
        });
}

function logout() {
    localStorage.removeItem("token");
    location.reload();
}

/*  AUTH HEADER */

function authHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
}

/* DASHBOARD  */

function loadDashboard() {
    // Load expenses and calculate total
    fetch(API + "/expenses", { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
            let total = 0;
            data.forEach(e => (total += e.amount));
            document.getElementById("total-spend").innerText = "₹" + total;
        });

    // Load AI advice
    fetch(API + "/ai/suggest", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ prompt: "Give spending advice" })
    })
        .then(res => res.text())
        .then(text => {
            document.getElementById("ai-advice").innerText = text;
        });
}

/* TRANSACTIONS */

function loadExpenses() {
    fetch(API + "/expenses", { headers: authHeaders() })
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("expense-table");
            table.innerHTML = "";

            data.forEach(e => {
                const row = `<tr>
          <td>${e.title}</td>
          <td>₹${e.amount}</td>
        </tr>`;
                table.innerHTML += row;
            });
        });
}

function addExpense() {
    const title = document.getElementById("exp-title").value;
    const amount = document.getElementById("exp-amount").value;

    if (!title || !amount) {
        alert("Please enter title and amount");
        return;
    }

    fetch(API + "/expenses", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
            title: title,
            amount: parseFloat(amount)
        })
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add expense");
            return res.json();
        })
        .then(() => {
            document.getElementById("exp-title").value = "";
            document.getElementById("exp-amount").value = "";
            loadExpenses();
        })
        .catch(() => alert("Failed to add expense"));
}

/*  LOGIN */

window.onload = function () {
    if (localStorage.getItem("token")) {
        showPage("dashboard");
    }
};
