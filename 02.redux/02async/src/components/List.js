import { connect } from 'react-redux';
import React, { Component } from 'react';
export default class List extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {data } = this.props;
    return (
      <ul>
        {data && data.map((item, idx) => <li key={idx}>{item.title}</li>)}
      </ul>
    );
  }
}
