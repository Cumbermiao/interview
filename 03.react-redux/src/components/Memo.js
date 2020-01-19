import React,{useState,useMemo} from 'react';

export default function Memo(){
  const [time,setTime] = useState(Date.now());
  const [count,setCount] = useState(100)
  return (
    <div>
      <Time time={time}></Time>
      <button onClick={()=>setTime(Date.now())}>refresh</button>
      <button onClick={()=>setCount(count-1)}>minus</button>
    </div>
  )
}

function Time({time}){
  console.log('time1');
  
  var wrapTime = time=>{
    console.log('wrapTime');
    return `it is ${time}`
  }
  time = useMemo(()=>wrapTime(time),[time])
  console.log('time2');
  // time = wrapTime(time)
  return <div>{time}</div>
}
