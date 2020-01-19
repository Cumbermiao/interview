import React, { Component } from 'react';
export default class Pick extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { children, className, selected, data, onChange } = this.props;
    return (
      <div>
        <h2>{selected}</h2>
        {data && (
          <select onChange={(e)=>onChange(e.target.value)} value={selected}>
            {data.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
}
