import React, { Component } from 'react';
import Counter from '../containers/Counter';
import Footer from './Footer';
import Memo from './Memo';
import Todo from './Todo';
export default class App extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {children, className} = this.props
    return (
      <div className={className}>
        <h1>App</h1>
        <Counter></Counter>
        <Todo></Todo>
        <Memo></Memo>
        <Footer></Footer>
      </div>
    )
  }
}