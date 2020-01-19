import TodoList from '../components/TodoList';
import {toggleToDo} from '../actions';
import {connect} from 'react-redux';

const mapStateToProps = (state) =>{
  let todos;
  switch (state.visibilityFilter){
    case 'SHOW_ALL':
      todos = state.todos;
      break;
    case 'SHOW_ACTIVE':
        todos = state.todos.filter(todo=>!todo.completed);
        break;
    case 'SHOW_COMPLETED':
        todos = state.todos.filter(todo=>todo.completed);
        break;
  }
  return {todos:todos?todos:[]}
}

const mapDispatchToProps = dispatch =>{
  return {
    toggleTodo:(todo)=>dispatch(toggleToDo(todo))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TodoList);