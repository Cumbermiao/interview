import {LOAD_POST_REQUEST,LOAD_POST_SUCCESS,LOAD_POST_FAILURE} from '../actions';

export default (store='',action)=>{
  switch (action.type){
    case LOAD_POST_REQUEST:
      console.log('loading');
      
      return 'loading';
    case LOAD_POST_SUCCESS:
        console.log('success');
      return 'success';
    case LOAD_POST_FAILURE:
        console.log('failure');
      return 'failure';
    default: return '';
  }
}