import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './reducers';
import App from './components/App'

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App></App>
  </Provider>,
  document.getElementById('app')
)