// const greeter = require('./Greeter.js');
import greeter from './Greeter';
console.log(greeter)
document.querySelector("#root").appendChild(greeter());

require('./test');