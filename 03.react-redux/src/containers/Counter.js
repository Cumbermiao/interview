import React from 'react';
import {connect} from 'react-redux';
import {_inheritsLoose} from '../utils'

const Counter = function(Component){
  _inheritsLoose(Counter,Component)
  function Counter(props){
    // return <div>count:{props.count||0}</div>
    var _this = Component.call(this,props) || this;
    return _this;
  }

  //TODO: why Provider add component hooks in prototype, it not excute
  var _proto = Counter.prototype;
  _proto.componentDidMount = function componentDidMount(){
    console.log('did Mount');
  }
  _proto.render = function(){
    console.log(this.props)
    return React.createElement('div',{},this.props.children)
  }
  console.log(connect())
  // return Counter

  const mapStateToProps = state =>({count:state.count});
  debugger;
  return connect(mapStateToProps)(Counter)
}(React.Component)

export default Counter