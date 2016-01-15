import {statusDescs} from '../helper';
import React, {Component} from 'react';

export default class extends Component {
  render() {
    const {status, className} = this.props;
    return <div className={`status-bar ${status} ${className}`}>{statusDescs(status)}</div>;
  }
}
