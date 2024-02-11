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

const account5 = {
  owner: 'Ahmed Adawy',
  movements: [600, -1000, 2000, 700, -100, 600, -50, 75],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerHideAPP = document.querySelector('.mainApp')
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.form__btn--logout');
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



//set sort to false by default
const displayMovements = function (movements, sort = false) {

  //Implementing sort
  //slice to create a copy of the array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements


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

    inputLoginUsername.style = "display: none"
    inputLoginPin.style = "display: none"
    btnLogin.style = "display: none"
    btnLogout.style = "display: block"
    containerHideAPP.classList.remove('mainApp')

    //Implementing Logout
    btnLogout.addEventListener('click', function (e) {
      e.preventDefault()
      btnLogout.style = "display: none"
      btnLogin.style = "display: block"
      inputLoginUsername.style = "display: block"
      inputLoginPin.style = "display: block"
      containerHideAPP.classList.add('mainApp')
      containerApp.style.opacity = 0;
    })

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
  else {
    let timerInterval;
    Swal.fire({
      title: "Wrong Username or Password!",
      html: `Try Again in <b></b> seconds.`,
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft() / 1000}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
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

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(displayMovements(currentAccount.movements, true));

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

// SOME method

//condition
console.log(movements.some(mov => mov === -130));

//equality
console.log(movements.includes(-130));

const anyDeposit = movements.some(mov => mov > 0)
console.log(anyDeposit);




//separate callback functions
const deposit = mov => mov > 0
const withdraw = mov => mov < 0

// EVERY method
console.log(movements.every(deposit)); //false
console.log(account4.movements.every(deposit)); //true
console.log(account4.movements.every(withdraw)); //false

//  flat and flatmap methods
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// flat method will flatten the arrays into a single array
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep);
console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overAllMovements = allMovements.reduce((accum, mov) => accum + mov, 0)
// console.log(overAllMovements);

const chainedOverAllMovements = accounts.map(acc => acc.movements).flat().reduce((accum, mov) => accum + mov, 0)
console.log(chainedOverAllMovements);

// flatMap method
const flatMapOverAllMovements = accounts.flatMap(acc => acc.movements).reduce((accum, mov) => accum + mov, 0)
console.log(flatMapOverAllMovements);


// sort method with strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha']
console.log(owners);
//ascending
console.log(owners.sort());

// sort method with numbers
console.log(movements);
console.log(movements.sort()); //wrong numbers order

// ascending order
movements.sort((a, b) => {
  // return < 0 => A, B (Keep order)
  // return > 0 => B, A (Switch order)
  if (a > b) return 1
  if (b > a) return -1
})
console.log(movements);

// arrow syntax for ascending
movements.sort((a, b) => a - b)
console.log(movements);