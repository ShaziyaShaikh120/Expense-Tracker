const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addExpense");

const expenseList = document.getElementById("expenseList");
const totalEl = document.getElementById("total");

const monthFilter = document.getElementById("monthFilter");
const monthlyTotalEl = document.getElementById("monthlyTotal");

const budgetInput = document.getElementById("budgetInput");
const saveBudgetBtn = document.getElementById("saveBudget");
const totalInEl = document.getElementById("totalIn");
const totalOutEl = document.getElementById("totalOut");
const balanceEl = document.getElementById("balance");

let expenses = [];
let total = 0;
let budget = 0;

// Load saved budget from localStorage
if (localStorage.getItem("budget")) {
  budget = Number(localStorage.getItem("budget"));
  budgetInput.value = budget;
}

// Save budget manually
saveBudgetBtn.addEventListener("click", () => {
  const input = Number(budgetInput.value);
  if (!input || input < 0) {
    alert("Baby, valid budget daalo 😜");
    return;
  }
  budget = input;
  localStorage.setItem("budget", budget);
  updateSummary();
});

// ➕➖ Add Expense
addBtn.addEventListener("click", () => {
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;
  const type = document.querySelector('input[name="type"]:checked').value;

  if (!amount || !category || !date) {
    alert("Oops! fill all the fields 😜");
    return;
  }

  const finalAmount = type === "in" ? amount : -amount;

  const expense = {
    amount,
    finalAmount,
    category,
    date,
    type
  };

  expenses.push(expense);
  total += finalAmount;

  updateTotal();
  renderExpenses();
  updateMonthlyTotal();

  amountInput.value = "";
  categoryInput.value = "";
  dateInput.value = "";
});

// 🔄 Render Table
function renderExpenses() {
  expenseList.innerHTML = "";

  expenses.forEach((exp, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="${exp.type}">
        ${exp.type === "in" ? "+" : "-"}₹${exp.amount}
      </td>
      <td>${exp.category}</td>
      <td>${exp.date}</td>
      <td>
        <button class="delete">❌</button>
      </td>
    `;

    tr.querySelector(".delete").addEventListener("click", () => {
      total -= exp.finalAmount;
      expenses.splice(index, 1);
      updateTotal();
      renderExpenses();
      updateMonthlyTotal();
    });

    expenseList.appendChild(tr);
  });
}

// 💰 Update Total Balance
function updateTotal() {
  totalEl.innerText = total;
}

// 💎 Update Summary (Total IN / OUT / Balance)
function updateSummary() {
  const totalIn = expenses.filter(e => e.type === "in").reduce((sum, e) => sum + e.amount, 0);
  const totalOut = expenses.filter(e => e.type === "out").reduce((sum, e) => sum + e.amount, 0);
  const balance = budget + totalIn - totalOut;

  totalInEl.innerText = totalIn;
  totalOutEl.innerText = totalOut;
  balanceEl.innerText = balance;
}

// 📅 Monthly Total
monthFilter.addEventListener("change", updateMonthlyTotal);

function updateMonthlyTotal() {
  const selectedMonth = monthFilter.value;
  let monthlyTotal = 0;

  expenses.forEach(exp => {
    if (exp.date.startsWith(selectedMonth)) {
      monthlyTotal += exp.finalAmount;
    }
  });

  monthlyTotalEl.innerText = monthlyTotal;
}