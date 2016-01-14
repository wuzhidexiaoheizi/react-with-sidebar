import React, {Component} from 'react';
import {connect} from 'react-redux';

class DetailPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>detail page</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    detail: state.home
  };
}

export default connect(mapStateToProps)(DetailPage);
