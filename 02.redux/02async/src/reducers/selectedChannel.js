import {SELECT_CHANNEL} from '../actions';

export default (state='reactjs',action)=>{
  switch (action.type){
    case SELECT_CHANNEL:
      return action.channel;
    default:
      return state;
  }
}