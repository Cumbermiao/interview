import React, { useState } from "react";
// import Header from './header';

export default function() {
  const [count, changeCount] = useState(0);
  return (
    <>
      <button onClick={() => changeCount(count + 1)}>click</button>
      <p>{count}</p>
    </>
  );
}

// import React, { Component } from 'react';
// import Module1 from './module1';
// console.log(Module1)

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       count:0
//     }
//   }
//   changeCount(count){
//     this.setState({
//       count
//     })
//   }

//   UNSAFE_componentWillMount(){
//     console.log('will mount');
//   }

//   componentDidMount(){
//     console.log("did mount",this)
//   }

//   render() {
//     console.log('render')
//     const { children, className } = this.props;
//     return (
//       <div>
//         <button onClick={() => this.changeCount(this.state.count+1)}>click</button>
//         <p>{this.state.count}</p>
//         <Module1></Module1>
//       </div>
//     );
//   }
// }
