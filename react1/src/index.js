import React from 'react';
import ReactDOM from 'react-dom';
import App from './view/app';

ReactDOM.render(<App></App>,document.getElementById('root'),function(){
  console.log('render done')
})