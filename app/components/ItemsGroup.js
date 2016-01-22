import React from 'react';
import Item from '../components/Item';

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

  if (!items.length) return <div/>;

  return (
    <div className="list-group">
      <img className="price-title" src={priceTitleImgUrl}/>
      {items.map(item => <Item key={item.id} {...item} {...boundActionCreators}/>)}
    </div>
  );
};
