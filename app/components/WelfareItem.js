import React, {Component} from 'react';

export default class WelfareItem extends Component {
  render() {
    const { status } = this.props;
    let statusDesc;

    switch (status) {
    case 'used': {
      statusDesc = '已使用';
    }
    case 'active': {
      statusDesc = '待使用';
    }
    case 'pending': {
      statusDesc = '待激活';
    }
    default:
      statusDesc = '待激活';
    }

    return (
      <div className={`welfare-item ${status}`}>
        <div className="welfare-board"></div>
        <div className="welfare-desc">{statusDesc}</div>
      </div>
    );
  }
}
