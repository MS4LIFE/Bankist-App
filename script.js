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
  movementsDates: [
    '2024-02-01T21:31:17.178Z',
    '2024-02-10T07:42:02.383Z',
    '2024-02-13T09:15:04.904Z',
    '2024-02-20T10:17:24.185Z',
    '2024-02-22T14:11:59.604Z',
    '2024-02-23T17:01:17.194Z',
    '2024-02-24T23:36:17.929Z',
    '2024-02-25T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Mohamed Abdo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2024-02-01T21:15:33.035Z',
    '2024-02-09T07:48:16.867Z',
    '2024-02-12T09:04:23.907Z',
    '2024-02-14T10:18:46.235Z',
    '2024-02-16T14:33:06.386Z',
    '2024-02-21T17:43:26.374Z',
    '2024-02-23T23:49:59.371Z',
    '2024-02-24T10:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Karim Magdy',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2024-03-05T14:22:09.123Z",
    "2024-03-11T08:37:54.456Z",
    "2024-03-15T16:59:32.789Z",
    "2024-03-19T12:45:20.567Z",
    "2024-03-24T19:30:48.901Z",
    "2024-03-28T23:10:11.234Z",
    "2024-04-02T05:55:33.543Z",
    "2024-04-06T09:26:44.876Z"
  ],
  currency: "USD",
  locale: "en-US"
};

const account4 = {
  owner: 'Ahmed Essam',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2024-03-01T18:08:37.456Z",
    "2024-03-07T10:41:45.789Z",
    "2024-03-10T14:57:29.234Z",
    "2024-03-13T20:12:53.567Z",
    "2024-03-18T04:29:16.901Z",
    "2024-03-22T11:04:08.234Z",
    "2024-03-26T15:33:51.543Z",
    "2024-03-30T21:19:02.876Z"
  ],
  currency: "USD",
  locale: "en-US"
};

const account5 = {
  owner: 'Ahmed Adawy',
  movements: [600, -1000, 2000, 700, -100, 600, -50, 75],
  interestRate: 1,
  pin: 5555,
  movementsDates: [
    "2024-02-28T22:45:10.567Z",
    "2024-03-06T12:30:22.901Z",
    "2024-03-09T17:15:37.234Z",
    "2024-03-12T21:40:48.543Z",
    "2024-03-17T03:05:59.876Z",
    "2024-03-21T06:44:34.456Z",
    "2024-03-25T10:59:12.789Z",
    "2024-03-29T14:23:51.123Z"
  ],
  currency: "USD",
  locale: "en-US"
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

// Implement movements date by day 
const formatMovementsDate = function (date, locale) {

  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1)
    /
    (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {

    //Create date manually
    // const day = date.getDate();
    // const month = date.getMonth() + 1;
    // const year = date.getFullYear();
    // return `${day > 9 ? day : `0${day}`}/${month > 9 ? month : `0${month}`}/${year}`

    //using Intl.DateTimeFormat
    return Intl.DateTimeFormat(locale).format(date)
  }
}

//formatted currencies using a reusable function
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value)
}

//set sort to false by default
const displayMovements = function (acc, sort = false) {

  //Implementing sort
  containerMovements.innerHTML = '';


  //slice to create a copy of the array
  const movs = sort ? acc.movements?.slice().sort((a, b) => a - b)
    : acc.movements;


  movs.forEach(function (mov, i) {

    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(acc.movementsDates[i])
    const displayDate = formatMovementsDate(date, acc.locale)

    //formatted currencies
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency)

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">
            ${formattedMov}
          </div>
    </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}

/*reduce method */
const calcDisplayBalance = function (acc) {

  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency)
}

// chaining
const calcDisplaySummary = function (acc) {
  const incomes = movements.filter(mov => mov > 0).reduce((accum, mov) => accum + mov, 0)
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency)

  const out = movements.filter(mov => mov < 0).reduce((accum, mov) => accum + mov, 0)
  labelSumOut.textContent = formatCurrency(Math.abs(out), acc.locale, acc.currency)


  const interest = movements.filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    // interest rate will apply on values more than 1 €
    .filter((interest, i, arr) => {
      console.log(arr);
      return interest >= 1
    })
    .reduce((accum, interest) => accum + interest, 0)

  labelSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency)
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
  displayMovements(acc)
  // Display Balance
  calcDisplayBalance(acc)
  // Display Summary
  calcDisplaySummary(acc)
}

// timer function
const startLogOutTimer = function () {
  // set time to 5 minutes
  let time = 300;
  console.log(time);
  // Call the timer every second
  const timer = setInterval(() => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60);
    // In each call print the remaining time
    labelTimer.textContent = `${min}:${sec > 9 ? sec : '0' + sec}`

    // Decrease 1s
    time--;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      btnLogout.style.display = "none";
      btnLogin.style.display = "block";
      inputLoginUsername.style.display = "block";
      inputLoginPin.style.display = "block";
      containerHideAPP.classList.add('mainApp');
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
      Swal.fire({
        title: "<strong>Session Expired !</strong>",
        icon: "info",
        showClass: {
          popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
        },
        hideClass: {
          popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
        }
      });
    }

  }, 1000)
}


// Event Login handler UI
let currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

// Internalization Date API
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long'
}
const locale = navigator.language;
// console.log(locale);
labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now)


//Create CURRENT DATE and TIME Manually

// const now = new Date();
// const day = now.getDate();
// const month = now.getMonth() + 1;
// const year = now.getFullYear();
// const hour = now.getHours();
// const min = now.getMinutes();
// labelDate.textContent = now
// day/month/year
// labelDate.textContent = `${day > 9 ? day : `0${day}`}/${month > 9 ? month : `0${month}`}/${year}, ${hour > 9 ? hour : `0${hour}`}:${min > 9 ? min : `0${min}`}`




btnLogin.addEventListener('click', function (e) {
  e.preventDefault()
  currentAccount = accounts.find(acc => (acc.username === inputLoginUsername.value));
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {

    inputLoginUsername.style = "display: none"
    inputLoginPin.style = "display: none"
    btnLogin.style = "display: none"
    btnLogout.style = "display: block"
    containerHideAPP.classList.remove('mainApp')


    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split('-')}`
    containerApp.style.opacity = 100

    //start timer
    startLogOutTimer()

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

//Implementing Logout
// const logOut = function (e) {
//   e.preventDefault()
//   btnLogout.style.display = "none"
//   btnLogin.style.display = "block"
//   inputLoginUsername.style.display = "block"
//   inputLoginPin.style.display = " block"
//   containerHideAPP.classList.add('mainApp')
//   containerApp.style.opacity = 0;
//   labelWelcome.textContent = 'Log in to get started'

// }
const logOut = function (e) {

  e.preventDefault()
  btnLogout.style.display = "none";
  btnLogin.style.display = "block";
  inputLoginUsername.style.display = "block";
  inputLoginPin.style.display = "block";
  containerHideAPP.classList.add('mainApp');
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';
};
btnLogout.addEventListener('click', logOut)

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

    // Add transfer date to movements dates array
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

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
  const amount = Math.floor(inputLoanAmount.value);
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

        //operation approved after 3 seconds
        setTimeout(() => {
          // Add movement
          Swal.fire("Loan Approved!", "", "success");
          currentAccount.movements.push(amount);

          // Add loan date to movementsDates using toISOString method
          currentAccount.movementsDates.push(new Date().toISOString());

          // Update UI
          updateUI(currentAccount)
        }, 3000);


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


        let timerInterval;
        Swal.fire({
          title: '',
          html: "Logging out in <b></b> seconds.",
          timer: 2000,
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
            logOut(e);
            Swal.close();
            btnLogout.style.display = "none";
            btnLogin.style.display = "block";
            inputLoginUsername.style.display = "block";
            inputLoginPin.style.display = "block";
            containerHideAPP.classList.add('mainApp');
            containerApp.style.opacity = 0;
            labelWelcome.textContent = 'Log in to get started';
          }
        });
      }
      updateUI()
    });




    // Clear input fields
    inputCloseUsername.value = inputClosePin.value = ''
    labelWelcome.textContent = 'Log in to get started';
  }
})

// Initialize the sortedState variable to keep track of the current sorting state
let sortedState = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // Call the displayMovements function to display the account movements with the updated sorting state
  // console.log(currentAccount.movements);
  displayMovements(currentAccount, !sortedState);
  // Toggle the sorting state for the next click
  sortedState = !sortedState;
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
// console.log(firstWithdrawal);
// console.log(accounts);

const jesAcc = accounts.find(acc => acc.owner === 'Jessica Davis')
// console.log(jesAcc);

for (const account of accounts) {
  account.owner === 'Jessica Davis' && console.log(account);
}

// SOME method

// condition
// console.log(movements.some(mov => mov === -130));

//equality
// console.log(movements.includes(-130));

const anyDeposit = movements.some(mov => mov > 0)
// console.log(anyDeposit);




//separate callback functions
const deposit = mov => mov > 0
const withdraw = mov => mov < 0

// EVERY method
// console.log(movements.every(deposit)); //false
// console.log(account4.movements.every(deposit)); //true
// console.log(account4.movements.every(withdraw)); //false

//  flat and flatmap methods
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// flat method will flatten the arrays into a single array
// console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep);
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overAllMovements = allMovements.reduce((accum, mov) => accum + mov, 0)
// console.log(overAllMovements);

const chainedOverAllMovements = accounts.map(acc => acc.movements).flat().reduce((accum, mov) => accum + mov, 0)
// console.log(chainedOverAllMovements);

// flatMap method
const flatMapOverAllMovements = accounts.flatMap(acc => acc.movements).reduce((accum, mov) => accum + mov, 0)
// console.log(flatMapOverAllMovements);


// sort method with strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha']
// console.log(owners);
//ascending
// console.log(owners.sort());

// sort method with numbers
// console.log(movements);
// console.log(movements.sort()); //wrong numbers order

// ascending order
movements.sort((a, b) => {
  // return < 0 => A, B (Keep order)
  // return > 0 => B, A (Switch order)
  if (a > b) return 1
  if (b > a) return -1
})
// console.log(movements);

// arrow syntax for ascending
movements.sort((a, b) => a - b)
// console.log(movements);


// Array methods practice
// 1
const bankDepositSum =
  //   accounts.map(mov => mov.movements)
  //   .flat()
  //   .reduce((acc, mov) => (mov > 0 ? acc + mov : acc), 0)
  // console.log(bankDepositSum);

  accounts.flatMap(mov => mov.movements)
    .filter(mov => mov > 0).reduce((accum, mov) => accum + mov, 0)
// console.log(bankDepositSum);

// 2
const numDeposits1000 =
  //   accounts
  //   .flatMap(mov => mov.movements)
  //   // number of deposits greater than 1000
  //   .filter(mov => mov >= 1000).length
  // console.log(numDeposits1000);

  accounts
    .flatMap(mov => mov.movements).reduce((count, cur) => {
      count += cur >= 1000
    })




// Dates Section Lectures
//checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));

// checking if value is integer
// console.log(Number.isInteger(20.5));
// console.log(Number.isInteger(20));

// Math Section
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.min(5, 18, 23, 11, 2));

// console.log(Math.PI);
// console.log(Math.PI * Number.parseFloat('10px') ** 2);


// random numbers
// console.log(Math.floor(Math.random() * 6) + 1);

const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(10, 20));
// console.log(randomInt(10, 20));

// rounding integers
// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// rounding decimals
// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// floor
// console.log(Math.floor(23.3));
// console.log(Math.floor('23.9'));

//rounding decimals
// console.log(+(2.7).toFixed(0));
// console.log(+(2.7).toFixed(3));
// console.log(+(2.345).toFixed(2));

// remainder operator
// console.log(5 % 2);
// console.log(5 / 2);

const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(514));


// Implementing Toggling styles
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    //change the color for every 2nd row
    // 0, 2, 4, 6, 8
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    //change the color for every 3rd row
    // 1, 3, 5, 7, 9
    if (i % 3 === 0) row.style.backgroundColor = 'lightblue';
  })
})

//Numeric separators
const diameter = 287_460_000_000;
// console.log(diameter);

const price = 345_99;
// console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;
// console.log(transferFee1, transferFee2);

const PI = 3.1415;
// console.log(PI);

// console.log(Number('230000'));   // 230000
// console.log(Number('230_000'));  // NaN
// console.log(Number.parseInt('230_000'));  // 230


// bigInt
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(Number(BigInt('23000000000000000000000000000')));
// console.log(BigInt(2234567898765432345678923456782345678n));
//n for bigint
// console.log(typeof (20n));
// console.log(20n > 15);
// console.log(20n === 20);

// division
// console.log(5n / 2n);
// console.log(5 / 2);




// Working with dates

// const now = new Date();
// console.log(now);
// console.log(new Date('Aug 02 2020 18:05:41'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(0));
// // convert from days to milliseconds
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());
// console.log(new Date(2142253380000));

// console.log(Date.now());

// future.setFullYear(2040); // same with months and days
// console.log(future);

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// //it will convert date to number in milliseconds
// console.log(-future);
// console.log(+future);
// console.log(Number(future));

// const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4))
// console.log(days1);