export default ({ getState, dispatch }) => next => action => {
  const { types, callAPI, shouldCallAPI = () => true, payload = {} } = action;
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

  if (shouldCallAPI(getState())) return;

  const [requestType, successType, failureType] = types;

  dispatch({ ...payload, type: requestType });
  return callAPI.then(
    res => dispatch({ ...payload, response: res, type: successType }),
    err => dispatch({ ...payload, error: err, type: failureType })
  );
};
