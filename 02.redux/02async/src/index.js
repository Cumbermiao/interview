import React from 'react';
import { render } from 'react-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
// import loadPostMiddleware from './enhancers/loadPost';
const loadPostMiddleware = ({ getState, dispatch }) => next => action => {
  const { types, callAPI, shouldCallAPI = () => true, payload = {} } = action;
  debugger;
  if (!types) return next(action);
  if (
    !Array.isArray(types) ||
    types.length !== 3 ||
    !types.every(type => typeof type === 'string')
  ) {
    throw new Error('Expected an array of three string types.');
  }

  if (typeof callAPI !== 'function') {
    throw new Error('Expected callAPI to be a function.');
  }

  // if (shouldCallAPI(getState())) return;

  const [requestType, successType, failureType] = types;

  dispatch({ ...payload, type: requestType });
  return callAPI().then(
    res => dispatch({ ...payload, response: res, type: successType }),
    err => dispatch({ ...payload, error: err, type: failureType })
  );
};

const canDispatchInMiddleware = ({getState,dispatch}) => next => action =>{
  debugger;
  if(!action.forbiddenDispatch){
    dispatch({...action,forbiddenDispatch:true});
  }
  // return next(action);
} 
const store = createStore(
  rootReducer,
  applyMiddleware(canDispatchInMiddleware)
);
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
