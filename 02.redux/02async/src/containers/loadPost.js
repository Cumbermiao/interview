import {connect} from 'react-redux';
import React, { Component } from 'react';
import {loadPost} from '../actions';
class LoadPost extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {children, className, onClick, dispatch} = this.props;
    console.log(this.props)
    return (
      <div>
        <button onClick={()=>{onClick()}}>LoadPost</button>
        <button onClick={()=>{dispatch({type:'dispatchInMiddleware'})}}>dispatchInMiddleware</button>
      </div>
    )
  }
}

const mapActionToProps = dispatch =>{
  return {
    onClick:()=>{
      dispatch(loadPost())
    },
    dispatch
  }
}

export default connect(null,mapActionToProps)(LoadPost)