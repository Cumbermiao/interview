import {combineReducers} from 'redux';
import selectedChannel from './selectedChannel';
import postChannel from './postChannel';
import loadPost from './loadPost';

export default combineReducers({
  selectedChannel,
  channels:postChannel,
  loadPost,
  dispatchInMiddleware:(state='',action)=>{
    switch (action.type){
      case 'dispatchInMiddleware':
        console.log('dispatchInMiddleware');
        return 'can';
      default: return state
    }
  }
})