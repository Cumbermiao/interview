const visibilityFilter = (state='SHOW_ALL',action)=>{
  return action.filter?action.filter:state
}
export default visibilityFilter