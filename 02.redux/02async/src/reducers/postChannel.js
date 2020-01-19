import {RECEIVE_POST}  from '../actions';

export default (state={},action)=>{
  if(action.type === RECEIVE_POST){
    let {channel,data,receiveAt} = action;
    return Object.assign({},state,{
      [channel]:{
        isFetching:false,
        isOverdu:false,
        lastUpdateTime:receiveAt,
        data
      }
    })
  }else return state
}