import React, {Component} from 'react';
import WelfareGroup from './WelfareGroup';

export default class Welfare extends Component {
  render() {
    const { seeds } = this.props;
    const total = seeds.length;
    let used_count = 0;
    let active_count = 0;
    let deactive_count = 0;

    seeds.forEach((seed) => {
      const status = seed.status;

      if (status == 'used') used_count += 1;
      if (status == 'active') active_count += 1;
      if (status == 'pending') deactive_count += 1;
    });

    return (
      <div className="welfare-zone">
        <div className="welfare-status">
          <div className="welfare-summary">
          您有{total}次额外抢购的机会.已使用{used_count}次
          待使用{active_count}次,未激活{deactive_count}次,</div>
          <div className="welfare-detail">
            <WelfareGroup seeds={seeds} />
          </div>
        </div>
      </div>
    );
  }
}
