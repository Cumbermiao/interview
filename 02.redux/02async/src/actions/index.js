
export const SELECT_CHANNEL = 'SELECT_CHANNEL';
export const REQUEST_POST = 'REQUEST_POST';
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
export const REQUEST_ERROR = 'REQUEST_ERROR';
export const RECEIVE_POST = 'RECEIVE_POST';

export const selectChannel = channel=>{
  return {
    type:SELECT_CHANNEL,
    channel
  }
}

export const requestPost = channel =>{
  return {
    type:'REQUEST_POST',
    channel
  }
}

export const requestSuccess = channel=>{
  return {
    type:'REQUEST_SUCCESS',
    channel
  }
}

export const requestError = channel=>{
  return {
    type:'REQUEST_ERROR',
    channel
  }
}

export const receiveRequest = (channel,json) =>{
  return {
    type:'RECEIVE_POST',
    channel,
    data:json.data.children.map(item=>item.data),
    receiveAt:Date.now()
  }
}


const fetchPost = channel => (dispatch)=>{
  dispatch(requestPost(channel));
  return fetch(`https://www.reddit.com/r/${channel}.json`)
          .then(res=>res.json())
          .then(json =>{
            dispatch(receiveRequest(channel,json));
          })
}

const shouldFetch = (state,channel)=>{
  let channelObj = state.channels[channel];
  if(!channelObj)return true;
  if(channelObj.isFetching)return false;
  return channelObj.isOverdue
}


export const postIfNeed = channel=>(dispatch, getState)=>{
  if(shouldFetch(getState(),channel)){
    return dispatch(fetchPost(channel))
  }
}

/**
 * loadPost middleware action creator
 */

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const loadPost = ()=>({
  types:[LOAD_POST_REQUEST,LOAD_POST_SUCCESS,LOAD_POST_FAILURE],
  callAPI: ()=>fetch(`https://www.reddit.com/r/frontend.json`),
  payload: {channel:'frontend'}
})