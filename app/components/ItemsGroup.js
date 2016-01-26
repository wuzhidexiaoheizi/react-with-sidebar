import React from 'react';
import Item from '../components/Item';
import TransitionGroup from 'react-addons-css-transition-group';

export default props => {
  const {items, price, boundActionCreators} = props;
  let priceTitleImgUrl;

  switch (price) {
  case 1:
    priceTitleImgUrl = 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/481aaafb7b83a363fcfa6ccc06dba553.png';
    break;
  case 5:
    priceTitleImgUrl = 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/041c2e92da98b77da4c12da56a24973d.png';
    break;
  case 10:
    priceTitleImgUrl = 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/d5c5812d7409f7aac7d15366ecae4345.png';
    break;
  default:
    priceTitleImgUrl = 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/375309f0feed7055dee38655f7725fd3.png';
  }

  return (
      <TransitionGroup className="list-group" transitionName="item" component="div" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        {items.length > 0 && <img className="price-title" src={priceTitleImgUrl}/>}
        {items.map(item => <Item key={item.id} {...item} {...boundActionCreators}/>)}
      </TransitionGroup>
  );
};
