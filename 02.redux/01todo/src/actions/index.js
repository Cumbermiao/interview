let nodeId = 0;
export const addToDo = text=>({
  type: 'ADD_TODO',
  id: ++nodeId,
  text
})

export const toggleToDo = todo=>({
  type: 'TOGGLE_TODO',
  todo
})

export const changeFilter = filter=>({
  type: 'CHANGE_FILTER',
  filter
})