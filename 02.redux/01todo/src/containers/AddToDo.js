import React, { Component } from 'react';
import { addToDo } from '../actions';
import {connect} from 'react-redux';
class AddToDo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { dispatch } = this.props;
    let input;
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          if(input.value.trim()){
            dispatch(addToDo(input.value));
            input.value = ''
          }
          
        }}
      >
        <input ref={node => {input = node}} />
        <button type='submit'>add todo</button>
      </form>
    );
  }
}

const cAddToDo = connect()(AddToDo)
export default cAddToDo;