import React,{useState} from 'react';
import m from './module3'

console.log('export',m)
export default function(props){
  let [name,changeName] = useState('your name');
  return (
    <div>
      <p>my name is {name}</p>
      <button onClick={()=>changeName('Terry')}>change</button>
    </div>
  )
}