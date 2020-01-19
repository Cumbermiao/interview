import React, { Component } from 'react';
import Pick from '../components/Pick';
import List from '../components/List';
import { selectChannel, postIfNeed } from '../actions';
import { connect } from 'react-redux';
import LoadPost from './loadPost';
class App extends Component {
  constructor(props) {
    super(props);
  }

  _change(channel) {
    let { dispatch } = this.props;
    dispatch(selectChannel(channel));
  }

  componentDidMount() {
    let { dispatch, selectedChannel } = this.props;
    // dispatch(postIfNeed(selectedChannel));
  }

  componentDidUpdate(prevProps) {
    let { dispatch, selectedChannel } = this.props;
    if (selectedChannel !== prevProps.selectedChannel) {
      dispatch(postIfNeed(selectedChannel));
    }
  }

  render() {
    const {
      className,
      selectedChannel,
      isFetching,
      isOverdue,
      data
    } = this.props;
    return (
      <div className={className}>
        <Pick
          data={['reactjs', 'frontend']}
          selected={selectedChannel}
          onChange={val => this._change(val)}
        />
        {isFetching ? (
          <h3>Loading...</h3>
        ) : data && data.length ? (
          <List data={data} />
        ) : (
          <h3>Empty</h3>
        )}
        <LoadPost></LoadPost>
      </div>
    );
  }
}

const mapStateToProps = state => {
  let { selectedChannel, channels } = state;
  let { isFetching = false, isOverdue = false, data = [] } = channels[
    selectedChannel
  ] || { isFetching: true, isOverdue: false, data: [] };
  return {
    selectedChannel: state.selectedChannel,
    isFetching,
    isOverdue,
    data
  };
};
export default connect(mapStateToProps)(App);
