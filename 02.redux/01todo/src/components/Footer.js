import React, { Component } from 'react';
import FilterLink from '../containers/FilterLink';
export default class Footer extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {children, className} = this.props
    return (
      <div className={className}>
        <big>Show:</big>
        <FilterLink filter='SHOW_ALL'>All</FilterLink>
        <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
        <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
      </div>
    )
  }
}