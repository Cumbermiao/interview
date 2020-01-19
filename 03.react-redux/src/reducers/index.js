import {combineReducers} from 'redux';

const countChange = (store=0,action)=>{
  switch (action.type){
    case 'COUNT_CHANGE':
      return action.count;
    default : 
      return store
  }
}

export default combineReducers({
  count:countChange
})