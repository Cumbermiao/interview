//--------plus
import minus from './minus.js';
let test = require('./test2.js');
const plus = function(num1,num2){
  return num1+num2
}

const plusOne = function(num){
  return num+1
}

const minusOne = function(num){
  return minus(num,1)
}

export {
  plus,
  plusOne,
  minusOne,
  test
}