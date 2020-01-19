//----------main
import {plus,minusOne} from './plus.js';
import test from './test.js'
const{a} = require('./test2.js');
import lodash from 'lodash';

let initCount = 1;
let fiberArr = [1,1];
debugger;
for(let i=2;i<20;i++){
  fiberArr[i] = plus(fiberArr[i-1],fiberArr[i-2]) 
}
console.log(fiberArr);

console.log(minusOne(10))

console.log(a)
console.log('test',test)