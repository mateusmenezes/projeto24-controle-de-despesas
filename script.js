const transactionUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") != null? localStorageTransactions : [];


const removetransaction = id => {
    transactions = transactions.filter(transaction => transaction.id !== id);
    // transactionUl.innerHTML = "";
    updateLocalStorage();
    init();

}
const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0? "-": "+";
    const CSSClass = transaction.amount < 0? "minus": "plus";
    const li = document.createElement("li");

    li.classList.add(CSSClass); // outra forma de adicionar uma classe em um elemento HTML
    li.innerHTML = `
        ${transaction.name}<span></span><span> ${operator} R$ ${Math.abs(transaction.amount)}</span><button class="delete-btn" onclick = "removetransaction(${transaction.id})">x</button>
    `;

    transactionUl.append(li);
    // Append sempre vai adicionar o elemento abaixo dos outros, por ultimo. Ja o metodo .prepend() vai adicionar o elemento sempre acima.
};


const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
        .filter(transaction => transaction < 0)
        .reduce((accumulator, expense) => accumulator + expense, 0))
        .toFixed(2);

const getIncomes = transactionsAmounts => transactionsAmounts
    .filter(transaction => transaction > 0)
    .reduce((accumulator, income) => accumulator + income, 0)
    .toFixed(2);

const getTotalBalance = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(transaction => transaction.amount);

    const total = getTotalBalance(transactionsAmounts);
    const income = getIncomes(transactionsAmounts);
    const expense = getExpenses(transactionsAmounts);


    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
}
updateBalanceValues();



const init = () => {
    transactionUl.innerHTML = "";
    transactions.forEach((transaction)=>{
        addTransactionIntoDOM(transaction);
    });
    updateBalanceValues();
}

init();

const updateLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}
const generateId = () => Math.round(Math.random() * 1000);

const addToTransactionArray = (transactionName, transactionAmount) => {
    const transaction = {
        id: generateId(),
        name: transactionName,
        amount: Number(transactionAmount)
    }
    transactions.push(transaction);
}
const cleanInputs = () => {
    inputTransactionName.value = "";
    inputTransactionAmount.value = "";
}
const handleFormSubmit = event =>{
    event.preventDefault();
    const transactionName = inputTransactionName.value.trim();
    const transactionAmount= inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

    if(isSomeInputEmpty){
        alert("Dados inválidos, preencha todos os campos");
        return false;
    }

    addToTransactionArray(transactionName, transactionAmount);
    init();
    updateLocalStorage();
    cleanInputs();
}

form.addEventListener("submit", handleFormSubmit);