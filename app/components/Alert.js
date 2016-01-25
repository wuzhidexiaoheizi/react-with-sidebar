import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import TransitionGroup from 'react-addons-css-transition-group';

export default class Alert extends Component {
  constructor(props) {
    super(props);
  }
  _renderAlert() {
    const {title, message, url, btn} = this.props.alert;
    return (
      <div className="alert-wrap">
        <div className="alert-container">
          <span onClick={() => this.props.dispatch({type: 'ALERT_CLOSE'})} className="close-btn">×</span>
          <div className="title">{title}</div>
          <div className="message" dangerouslySetInnerHTML={{__html: message}}/>
          {url && <div style={{textAlign: 'center'}}><a className="url-btn" href={url}>{btn}</a></div>}
        </div>
      </div>
    );
  }
  render() {
    const {show} = this.props.alert;
    return (
      <TransitionGroup
        transitionName="fade"
        component="div"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        {show && this._renderAlert()}
      </TransitionGroup>
    );
  }
}

Alert.defaultProps = {
  title: '提示信息'
};

Alert.propTypes = {
  alert: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    alert: state.alert,
  };
}

export default connect(mapStateToProps)(Alert);
