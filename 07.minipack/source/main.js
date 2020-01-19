import {plus} from './plus.js';

let initCount = 1;
let fiberArr = [1,1];
debugger;
for(let i=2;i<20;i++){
  fiberArr[i] = plus(fiberArr[i-1],fiberArr[i-2]) 
}
console.log(fiberArr);