import React, { Component, Fragment } from 'react';
import Todo from './Todo';
export default class TodoList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { todos, toggleTodo } = this.props;
    console.log(toggleTodo);
    return (
      <ul>
        {todos &&
          todos.map(item => (
            <Todo todo={item} key={item.id} onClick={() => toggleTodo(item)} />
          ))}
      </ul>
    );
  }
}
