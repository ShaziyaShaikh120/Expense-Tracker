const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addExpense");

const expenseList = document.getElementById("expenseList");
const totalEl = document.getElementById("total");

const monthFilter = document.getElementById("monthFilter");
const monthlyTotalEl = document.getElementById("monthlyTotal");

const clearAllBtn = document.getElementById("clearAll");

// Load from localStorage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let total = 0;
let editIndex = null;

// Initial calculation
expenses.forEach(exp => total += exp.finalAmount);
updateTotal();
renderExpenses();
updateMonthlyTotal();

// ➕➖ Add / Update Expense
addBtn.addEventListener("click", () => {
  const amount = Number(amountInput.value);
  const category = categoryInput.value.trim();
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

  // ✏️ EDIT MODE
  if (editIndex !== null) {
    total -= expenses[editIndex].finalAmount;
    expenses[editIndex] = expense;
    total += finalAmount;
    editIndex = null;
    addBtn.innerText = "Add Expense";
  } 
  // ➕ ADD MODE
  else {
    expenses.push(expense);
    total += finalAmount;
  }

  localStorage.setItem("expenses", JSON.stringify(expenses));

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
      <td class="category-cell">${exp.category}</td>
      <td>${exp.date}</td>
      <td>
        <button class="edit">✏️</button>
        <button class="delete">❌</button>
      </td>
    `;

    // ❌ Delete
    tr.querySelector(".delete").addEventListener("click", () => {
      total -= exp.finalAmount;
      expenses.splice(index, 1);
      localStorage.setItem("expenses", JSON.stringify(expenses));
      updateTotal();
      renderExpenses();
      updateMonthlyTotal();
    });

    // ✏️ Edit
    tr.querySelector(".edit").addEventListener("click", () => {
      amountInput.value = exp.amount;
      categoryInput.value = exp.category;
      dateInput.value = exp.date;
      document.querySelector(`input[name="type"][value="${exp.type}"]`).checked = true;

      editIndex = index;
      addBtn.innerText = "Update Expense";
    });

    expenseList.appendChild(tr);
  });
}

// 🗑 Clear All
clearAllBtn.addEventListener("click", () => {
  if (!confirm("Are you sure? All expenses will be deleted 😢")) return;

  expenses = [];
  total = 0;
  localStorage.removeItem("expenses");

  updateTotal();
  renderExpenses();
  updateMonthlyTotal();
});

// 💰 Update Total
function updateTotal() {
  totalEl.innerText = total;
}

// 📅 Monthly Total
monthFilter.addEventListener("change", updateMonthlyTotal);

function updateMonthlyTotal() {
  const selectedMonth = monthFilter.value;
  let monthlyTotal = 0;

  expenses.forEach(exp => {
    if (selectedMonth && exp.date.startsWith(selectedMonth)) {
      monthlyTotal += exp.finalAmount;
    }
  });

  monthlyTotalEl.innerText = monthlyTotal;
}
