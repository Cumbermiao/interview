import React, { useState } from 'react';

function test(name){
  return name+'http'
}
export default function(props) {
  let [count, changeCount] = useState(0);
  test("hello")
  return (
    <div>
      <button onClick={() => changeCount(count + 1)}> Click </button>
      <p>{count}</p>
    </div>
  );
}
