import {statusDescs} from '../helper';
import React, {Component} from 'react';

export default class extends Component {
  handleClick() {
    console.log(this.props.status);

    const {status, className, grab, id} = this.props;
    if (className && !className.includes('btn')) return;

    if (status == 'started') {
      console.log('可以抢...');
      grab(id);
    } else if (status == 'pending') {
      console.log('去领取奖励!');
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
