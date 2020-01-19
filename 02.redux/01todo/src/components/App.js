import React, { Component } from 'react';
import AddToDo from '../containers/AddToDo';
import FilterTodos from '../containers/FilterTodos';
import Footer from './Footer';
export default class  extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {children, className} = this.props
    return (
      <div className={className}>
        <AddToDo></AddToDo>
        <FilterTodos></FilterTodos>
        <Footer></Footer>
      </div>
    )
  }
}