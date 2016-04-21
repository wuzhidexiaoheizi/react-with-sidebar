import React from 'react';
import WelfareItem from './WelfareItem';

export default props => {
  const { seeds } = props;

  const invited = seeds.filter(seed => !!seed.given_id);
  const invited_count = invited.length;

  return (
    <div className="spread-status">
      <div className="invited-summary">
        <div className="invited-count">
          已有<span className="count">{invited_count}</span>人回应
        </div>
        我邀请的好友
      </div>
      <div className="list-group">
        {seeds.map(seed => <WelfareItem key={seed.id} {...seed} />)}
      </div>
    </div>
  );
};
