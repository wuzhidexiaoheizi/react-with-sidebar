import React from 'react';
import TransitionGroup from 'react-addons-css-transition-group';
import WelfareItem from './WelfareItem';

export default props => {
  const { seeds } = props;

  return (
    <TransitionGroup className="list-group clearfix" transitionName="item" component="div" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
      {seeds.map(seed => <WelfareItem key={seed.id} {...seed} />)}
    </TransitionGroup>
  );
};
