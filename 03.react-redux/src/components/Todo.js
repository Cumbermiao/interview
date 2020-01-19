import React,{useState} from 'react';

function Todo(props){
  const [todos, toggle] = useState([{label:'first todo',complete:true}]);
  return (
    <ul>
      {
        todos && todos.map((item,idx)=>(
          <li key={idx}>
            <span style={{textDecoration:item.complete?'line-through':'none'}}>{item.label}</span>
            <button style={{marginLeft:"6px"}} onClick={()=>{
              let backup = todos.slice(0);
              backup[idx].complete = !backup[idx].complete;
              toggle(backup)
            }}>toggle</button>
          </li>
        ))
      }
    </ul>
  )
}

export default Todo;