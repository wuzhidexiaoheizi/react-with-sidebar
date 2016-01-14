import React, {Component} from 'react';

export default class extends Component {
  statusDescs() {
    switch (this.props.status) {
    case 'wait': return '请等待';
    case 'started': return '马上抢购';
    case 'end': return '活动已结束';
    case 'suspend': return '已售罄';
    case 'no-executies': return '已经不能再强此商品了';
    default: return '...';
    }
  }

  render() {
    const {status, className} = this.props;
    return <div className={`status-bar ${status} ${className}`}>{this.statusDescs()}</div>;
  }
}
