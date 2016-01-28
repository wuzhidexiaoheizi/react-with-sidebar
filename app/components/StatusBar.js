import {statusDescs} from '../helper';
import React, {Component} from 'react';

export default class extends Component {
  handleClick() {
    const {fetchGrab, status, className, grabs, id} = this.props;
    if (className && !className.includes('btn')) return;

    if (status == 'started') {
      fetchGrab(id);
    } else if (status == 'pending') {
      console.log('去领取奖励!');
      location.href = grabs[0].callback_url;
    } else {
      console.log('不能抢...');
    }
  }

  render() {
    const {status, className} = this.props;
    return (
      <div
        className={`status-bar ${status} ${className}`}
        onClick={this.handleClick.bind(this)}>
        {statusDescs(status)}
      </div>
    );
  }
}
