const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addExpense");
const expenseList = document.getElementById("expenseList");
const totalEl = document.getElementById("total");
const monthFilter = document.getElementById("monthFilter");
const monthlyTotalEl = document.getElementById("monthlyTotal");


let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = null;


// Load existing expenses
renderExpenses();

addBtn.addEventListener("click", () => {
  const amount = amountInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!amount || !category || !date) return;

    if (editIndex === null) {
      expenses.push({ amount: Number(amount), category, date });
  } else {
    expenses[editIndex] = { amount: Number(amount), category, date };
    editIndex = null;
    addBtn.textContent = "Add Expense";
  }

  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  clearInputs();
});

monthFilter.addEventListener("change", () => {
  calculateMonthlyTotal(monthFilter.value);
});


function renderExpenses() {
  expenseList.innerHTML = "";
  let total = 0;

  expenses.forEach((expense, index) => {
    total += expense.amount;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>₹${expense.amount}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>
        <button onclick="editExpense(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
      </td>
    `;

    expenseList.appendChild(row);

  });

  totalEl.textContent = total;
}

function editExpense(index) {
  const expense = expenses[index];

  amountInput.value = expense.amount;
  categoryInput.value = expense.category;
  dateInput.value = expense.date;

  editIndex = index;
  addBtn.textContent = "Update Expense";
}


function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

function clearInputs() {
  amountInput.value = "";
  categoryInput.value = "";
  dateInput.value = "";
}

function calculateMonthlyTotal(selectedMonth) {
  let total = 0;

  expenses.forEach(exp => {
    const expMonth = exp.date.slice(0, 7); // yyyy-mm

    if (expMonth === selectedMonth) {
      total += exp.amount;
    }
  });

  monthlyTotalEl.textContent = total;
}






