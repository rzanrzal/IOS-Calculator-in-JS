//////////////////////////////////////////////////////////
// Pobranie wartości

const screen = document.querySelector('.screen');
const keyboardKeys = document.querySelectorAll('.keyboard__key');
const mathOperators = document.querySelectorAll('.operator');
const clear = document.querySelector('.clear');
const equals = document.querySelector('.equals');
const plusMinus = document.querySelector('.plus-minus');
const percent = document.querySelector('.percent');

//////////////////////////////////////////////////////////
// Zmienne

let screenValue = '0';
let firstValue = 0;
let secondValue = null;
let tempValue = null;
let operator = null;
let lastOperator = null;
let isAfterEquals = false;
let result = null;
let operatorGroup = null;
let lastOperatorGroup = null;
let backup = null;

//////////////////////////////////////////////////////////
// Funkcje

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
  result = null;
  tempValue = null;
  lastOperator = null;
  operatorChanged = false;
  display(screenValue);
  removeActiveOperatorClass();
  isAfterEquals = false;
  clear.textContent = 'AC';
  backup = null;
};

const removeActiveOperatorClass = function () {
  mathOperators.forEach((operator) => {
    operator.classList.remove('active');
  });
};

const toggleSign = function (value) {
  return value.includes('-') ? value.replace('-', '') : `-${value}`;
};

const operation = (num1, num2, mathOperator) => {
  const operations = [num1 / num2, num1 * num2, num1 - num2, num1 + num2];
  return operations[mathOperator] || 0;
};

const handleKeyClick = (key) => {
  let keyValue = key.textContent;
  if (keyValue === ',') keyValue = '.';
  if (keyValue === '.' && screenValue.includes('.')) return;
  if (screenValue.length >= 9) return;

  if (isAfterEquals) {
    clearScreen();
  }

  if (
    (screenValue.startsWith('0') &&
      keyValue !== '.' &&
      !screenValue.startsWith('0.')) ||
    (screenValue.startsWith('-0') &&
      keyValue !== '.' &&
      !screenValue.startsWith('-0.'))
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

  if (screen.textContent !== '0') {
    clear.textContent = 'C';
  }
};

const handleOperatorClick = (i, operatorKey) => {
  if (operator === 2 || operator === 3) {
    lastOperator = operator;
  }
  operatorGroup = i < 2 ? 1 : 2;

  if (
    tempValue !== null &&
    firstValue !== null &&
    secondValue !== null &&
    operatorGroup === 1
  ) {
    let temp = operation(firstValue, secondValue, operator);
    display(temp);
    firstValue = temp;
    secondValue = null;
  }

  if (
    tempValue !== null &&
    firstValue !== null &&
    secondValue !== null &&
    lastOperator !== null
  ) {
    let temp = operation(firstValue, secondValue, operator);
    result = operation(tempValue, temp, lastOperator);
    display(result);
    tempValue = null;
    firstValue = result;
    secondValue = null;
    lastOperator = null;
    backup = null;
  }

  if (backup !== null && operatorGroup !== lastOperatorGroup) {
    firstValue = backup.firstValue;
    secondValue = backup.secondValue;
    operator = backup.operator;
    lastOperator = backup.lastOperator;
    if (operatorGroup === 2 && tempValue !== null) {
      tempValue = null;
    } else if (operatorGroup === 2) {
    }
  }

  if (
    firstValue !== null &&
    secondValue !== null &&
    lastOperator !== null &&
    !isAfterEquals
  ) {
    backup = { firstValue, secondValue, operator, lastOperator };
    console.log('zapisano backup');
    console.log(backup);
  }

  if (secondValue !== null && operator !== null && !isAfterEquals) {
    if (operatorGroup === 1 && lastOperator !== null) {
      display(secondValue);
      tempValue = firstValue;
      firstValue = secondValue;
      secondValue = null;
    } else {
      result = operation(firstValue, secondValue, operator);
      display(result);
      firstValue = result;
      secondValue = null;
      console.log('wykonano operacje');
    }
  }

  operator = i;
  screenValue = '0';
  removeActiveOperatorClass();
  operatorKey.classList.add('active');
  lastOperatorGroup = operatorGroup;

  if (isAfterEquals) {
    secondValue = null;
    isAfterEquals = false;
  }
};

const handleEqualsClick = () => {
  if (operator === null || firstValue === null) return;
  if (secondValue === null) secondValue = firstValue;

  let localResult = operation(firstValue, secondValue, operator);

  if (
    tempValue !== null &&
    firstValue !== null &&
    secondValue !== null &&
    lastOperator !== null
  ) {
    let temp = operation(firstValue, secondValue, operator);
    localResult = operation(tempValue, temp, lastOperator);
    tempValue = null;
    lastOperator = null;
  }

  screenValue = String(localResult);
  firstValue = localResult;
  display(screenValue);
  isAfterEquals = true;
  removeActiveOperatorClass();
};

const handlePlusMinusClick = () => {
  let saved = screenValue;
  screenValue = toggleSign(screenValue);
  if (firstValue === Number(saved) && secondValue === null) {
    firstValue = Number(screenValue);
  } else if (secondValue === Number(saved)) {
    secondValue = Number(screenValue);
  }

  display(screenValue);
};

const handlePercentClick = () => {
  screenValue = String(screenValue / 100);
  firstValue = Number(screenValue);
  display(screenValue);
};

//////////////////////////////////////////////////////////
// Nasłuchiwanie

keyboardKeys.forEach((key) => {
  key.addEventListener('click', () => handleKeyClick(key));
});

mathOperators.forEach((operatorKey, i) => {
  operatorKey.addEventListener('click', () =>
    handleOperatorClick(i, operatorKey)
  );
});

clear.addEventListener('click', clearScreen);

equals.addEventListener('click', handleEqualsClick);

plusMinus.addEventListener('click', handlePlusMinusClick);

percent.addEventListener('click', handlePercentClick);
