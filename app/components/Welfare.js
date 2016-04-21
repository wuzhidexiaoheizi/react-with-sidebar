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

    // const timeout_count = total - used_count - active_count - deactive_count;

    const invited = seeds.filter(seed => !!seed.given_id);
    const count = invited.length;

    return (
      <div className="welfare-zone">
        <div className="welfare-status">
          <div className="welfare-summary">
            <ul>
              <li><p>1. 发送此页面邀请你的好友参加。</p></li>
              <li><p>2. 好友通过您的链接进入活动后您额外获得一次抢购机会。</p></li>
              <li><p>3. 此次活动您最多获得{total}次额外抢购机会</p></li>
            </ul>
          </div>
          <div className="welfare-detail">
            <div className="invited-count">已有{count}人通过您的链接进入活动</div>
            <WelfareGroup seeds={seeds} />
          </div>
        </div>
      </div>
    );
  }
}

// 您有{total}次额外抢购的机会。已使用{used_count}次，
// 待使用{active_count}次，
// 未激活{deactive_count}次，
// 已失效{timeout_count}次。
