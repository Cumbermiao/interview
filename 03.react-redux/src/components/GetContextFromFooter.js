import React, { Component } from 'react';
import {testContext} from '../context';
export default class GetContextFromFooter extends Component{
  static contextType = testContext;
  render(){
    console.log(this)
    const {children, className} = this.props
    return (
      <div className={className}>
        {children}
      </div>
    )
  }
}