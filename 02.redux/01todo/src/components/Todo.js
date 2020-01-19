import React, { Component } from 'react';
export default class Todo extends Component{
  constructor(props){
    super(props);
  }
  render(){
    let {todo} = this.props;
    return (
      <li style={{textDecoration:todo.completed?'line-through':'none'}} {...this.props}>
        {todo.text}
      </li>
    )
  }
}