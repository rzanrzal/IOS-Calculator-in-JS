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

const display = function (message) {
  screen.textContent = String(message)
    .replaceAll('.', ',')
    .replace('NaN', 'Błąd')
    .replace('Infinity', 'Błąd');
};

const clearScreen = function () {
  screenValue = '0';
  firstValue = 0;
  secondValue = null;
  operator = null;
  display(screenValue);
  removeActiveOperatorClass();
  isAfterEquals = false;
  clear.textContent = 'AC';
};

const removeActiveOperatorClass = function () {
  mathOperators.forEach((operator) => {
    operator.classList.remove('active');
  });
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
      removeActiveOperatorClass();
      secondValue = Number(screenValue);
    }

    display(screenValue);

    if (screen.textContent.length > 0) {
      clear.textContent = 'C';
    }
  });
}

for (const [i, operatorKey] of mathOperators.entries()) {
  operatorKey.addEventListener('click', function () {
    if (secondValue !== null && operator !== null && !isAfterEquals) {
      let result = operation(firstValue, secondValue, operator);
      display(result);
      firstValue = result;
      secondValue = null;
    }

    operator = i;
    screenValue = '0';
    removeActiveOperatorClass();
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

  screenValue = String(result);
  firstValue = result;
  display(screenValue);
  isAfterEquals = true;
  removeActiveOperatorClass();
});

plusMinus.addEventListener('click', function () {
  screenValue = toggleSign(screenValue);
  firstValue = Number(screenValue);

  display(screenValue);
});

percent.addEventListener('click', function () {
  screenValue = String(screenValue / 100);
  firstValue = Number(screenValue);
  display(screenValue);
});
