const keyboardKeys = document.querySelectorAll('.keyboard__key');

const mathOperators = document.querySelectorAll('.operator');

const clear = document.querySelector('.clear');

const equals = document.querySelector('.equals');

const screen = document.querySelector('.screen');

const plusMinus = document.querySelector('.plus-minus');

const percent = document.querySelector('.percent');

let screenValue = '0';

let firstValue = 0;
let secondValue = null;
let operator = null;
let isAfterEquals = false;
let history = [];

const updateScreen = function () {
  string = String(screenValue);
  screen.textContent = string
    .replaceAll('.', ',')
    .replace('NaN', 'Błąd')
    .replace('Infinity', 'Błąd');
};

const clearScreen = function () {
  screenValue = '0';
  firstValue = 0;
  secondValue = null;
  operator = null;
  updateScreen();
  removeActiveOperator();
  isAfterEquals = false;
  clear.textContent = 'AC';
};

const removeActiveOperator = function () {
  mathOperators.forEach((operator) => {
    operator.classList.remove('active');
  });
  console.log('removeActiveOperator()');
};

const toggleSign = function (value) {
  return value.includes('-') ? value.replace('-', '') : `-${value}`;
};

const operation = function (num1, num2, mathOperator) {
  switch (mathOperator) {
    case 0:
      return num1 / num2;
    case 1:
      return num1 * num2;
    case 2:
      return num1 - num2;
    case 3:
      return num1 + num2;
    default:
      return 0;
  }
};

for (const key of keyboardKeys) {
  key.addEventListener('click', function () {
    let keyValue = key.textContent;
    if (keyValue === ',') keyValue = '.';
    if (keyValue === '.' && screenValue.includes('.')) return;
    if (screenValue.length >= 9) return;

    if (isAfterEquals) {
      clearScreen();
    }

    if (
      screenValue.startsWith('0') &&
      keyValue !== '.' &&
      !screenValue.startsWith('0.')
    ) {
      screenValue = screenValue.replace('0', '');
    }

    screenValue += keyValue;

    if (operator === null) {
      firstValue = Number(screenValue);
    } else {
      removeActiveOperator();
      secondValue = Number(screenValue);
    }

    updateScreen();

    if (screen.textContent.length > 0) {
      clear.textContent = 'C';
    }
  });
}

for (const [i, operatorKey] of mathOperators.entries()) {
  operatorKey.addEventListener('click', function () {
    operator = i;
    screenValue = '0';
    removeActiveOperator();
    operatorKey.classList.add('active');

    if (isAfterEquals) {
      secondValue = null;
      isAfterEquals = false;
    }
  });
}

clear.addEventListener('click', clearScreen);

equals.addEventListener('click', function () {
  if (operator === null || firstValue === null) return;

  let result = operation(firstValue, secondValue, operator);
  console.log(result.toFixed(2));

  screenValue = String(result);
  firstValue = result;
  updateScreen();
  isAfterEquals = true;
  removeActiveOperator();
});

plusMinus.addEventListener('click', function () {
  screenValue = toggleSign(screenValue);
  firstValue = Number(screenValue);

  updateScreen();
});

percent.addEventListener('click', function () {
  screenValue = String(screenValue / 100);
  firstValue = Number(screenValue);
  updateScreen();
});
