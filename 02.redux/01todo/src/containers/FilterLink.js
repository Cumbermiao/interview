import {connect} from 'react-redux';
import Link from '../components/Link';
import {changeFilter} from '../actions';

const mapStateToProps = (state,ownProps) =>({
  active: state.visibilityFilter === ownProps.filter
})

const mapDispatchToProps = (dispatch,ownProps) =>({
  onClick: ()=>dispatch(changeFilter(ownProps.filter))
})

export default connect(mapStateToProps,mapDispatchToProps)(Link)