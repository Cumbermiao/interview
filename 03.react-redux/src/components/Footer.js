import React, { Component } from 'react';
import GetContextFromFooter from './GetContextFromFooter';
import {testContext} from '../context';
import {ReactReduxContext} from 'react-redux';
// export const testContext = React.createContext(null);

// class GetContextFromFooter extends Component{
//   static contextType = testContext;
//   render(){
//     console.log(this)
//     const {children, className} = this.props
//     return (
//       <div className={className}>
//         {children}
//       </div>
//     )
//   }
// }

export default class Footer extends Component {
  constructor(props) {
    super(props);
  }

  static contextType = ReactReduxContext;

  render() {
    console.log(this);

    const { children, className } = this.props;
    return (
      <testContext.Provider value={{ name: 'test context' }}>
        <div className={className}>Footer</div>
        <GetContextFromFooter></GetContextFromFooter>
      </testContext.Provider>
    );
  }
}
