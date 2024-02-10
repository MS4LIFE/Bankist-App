'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Mohamed Sabry',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Mohamed Abdo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Karim Magdy',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Ahmed Essam',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');




const displayMovements = function (movements) {

  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="movements__value">
            ${mov}€
          </div>
    </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}

/*reduce method */
const calcDisplayBalance = function (acc) {

  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = `${acc.balance} EUR`
}

// chaining
const calcDisplaySummary = function (acc) {
  const incomes = movements.filter(mov => mov > 0).reduce((accum, mov) => accum + mov, 0)
  labelSumIn.textContent = `${incomes} €`

  const out = movements.filter(mov => mov < 0).reduce((accum, mov) => accum + mov, 0)
  labelSumOut.textContent = `${Math.abs(out)} €`


  const interest = movements.filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    // interest rate will apply on values more than 1 €
    .filter((interest, i, arr) => {
      console.log(arr);
      return interest >= 1
    })
    .reduce((accum, interest) => accum + interest, 0)

  labelSumInterest.textContent = `${interest.toFixed(1)} €`
}

/*forEach method */
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(word => word[0]).join('');
  })
}
createUserNames(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements)
  // Display Balance
  calcDisplayBalance(acc)
  // Display Summary
  calcDisplaySummary(acc)
}

// Event Login handler UI
let currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);


btnLogin.addEventListener('click', function (e) {
  e.preventDefault()
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split('-')}`
    containerApp.style.opacity = 100

    // Display UI
    updateUI(currentAccount)

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''
    // Input Field lose focus
    inputLoginPin.blur()

  }
})

// Implementing Transfers
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault()
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = ''

  if (receiverAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    console.log('Transfer valid');

    // Doing the transfer
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)

    // Update UI
    updateUI(currentAccount)
  }
})


// Implementing Loan

inputLoanAmount.addEventListener('click', function () {
  Swal.fire({
    title: "IMPORTANT NOTE!",
    text: "Please note:Your biggest transaction is maximum 10% of your Loan amount!",
    imageUrl: "https://unsplash.it/400/200",
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: "Custom image"
  });
})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    Swal.fire({
      title: `Are you sure you want to loan ${amount}?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes, I'm sure!",
      denyButtonText: `No, Cancel it!`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        // Add movement
        Swal.fire("Loan Approved!", "", "success");
        currentAccount.movements.push(amount);

        // Update UI
        updateUI(currentAccount)

      } else if (result.isDenied) {
        Swal.fire("Operation Canceled!", "", "info");
      }
    });



  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: " You requested more than 10% of your current balance!",
      footer: '<a href="#">Why do I have this issue?</a>'
    });

  }
  inputLoanAmount.value = '';
})


btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (currentAccount?.username === inputCloseUsername.value && currentAccount?.pin === Number(inputClosePin.value)) {
    console.log('Account closed');
    // Find index
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    console.log(index);

    // Delete account

    Swal.fire({
      title: "Are you sure you want to delete this account?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        accounts.splice(index, 1)
        containerApp.style.opacity = 0;
        Swal.fire({
          title: "Deleted!",
          text: "Your account has been deleted.",
          icon: "success"
        });
      }
    });




    // Clear input fields
    inputCloseUsername.value = inputClosePin.value = ''
    labelWelcome.textContent = 'Log in to get started';
  }
})




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*Filter method */
// const deposits = movements.filter(function (mov) {
//   return mov > 0
// })

const deposits = movements.filter(mov => mov > 0)
// console.log(movements);
// console.log(deposits);
/////////////////////////////////////////////////

const depositArr = []
for (const mov of movements) if (mov > 0) {
  depositArr.push(mov)
}

// console.log(depositArr);
const withdrawals = movements.filter(mov => mov < 0)
// console.log(withdrawals);
// console.log(movements);


/*Reduce method */
// Accumulator
//0 is the initial value of the accumulator
// const balance = movements.reduce(function (accumulator, currentElement, index, array) {
//   console.log(`Iteration ${index}: ${accumulator} = ${currentElement}`);
//   return accumulator + currentElement
// }, 0)
const balance = movements.reduce((accumulator, currentElement, index, array) => {
  // console.log(`Iteration ${index}: ${accumulator} = ${currentElement} --- ${array}`);
  return accumulator + currentElement
}, 0)

// console.log(balance);

let sum = 0
for (const mov of movements) {
  sum += mov
}
// console.log(sum);

// Maximum value --- movements[0] is initial value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc
//   } else
//     return mov
// }, movements[0]
// )
const max = movements.reduce((acc, mov) => (acc > mov ? acc : mov), movements[0])
// console.log(max);


// Chain Methods
const eurToUsd = 1.1;
const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((accum, mov) => accum + mov, 0)
// console.log(totalDepositsUSD);
// console.log(movements);


// Tracking changed array in the process to debug potential errors
const totalDepositsUSD2 = movements.filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd
  }).reduce((accum, mov) => accum + mov, 0)
// console.log(totalDepositsUSD);
// console.log(movements);


// find method
const firstWithdrawal = movements.find(mov => mov < 0)
console.log(firstWithdrawal);
console.log(accounts);

const jesAcc = accounts.find(acc => acc.owner === 'Jessica Davis')
console.log(jesAcc);

for (const account of accounts) {
  account.owner === 'Jessica Davis' && console.log(account);
}

// some method

//condition
console.log(movements.some(mov => mov === -130));

//equality
console.log(movements.includes(-130));

const anyDeposit = movements.some(mov => mov > 0)
console.log(anyDeposit);
