import React, { Component } from 'react';
export default class Link extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {children,onClick,active} = this.props;
    return (
      <button onClick={()=>onClick()} disabled={active?'disabled':''} style={{marginLeft:'6px'}}>{children}</button>
    )
  }
}