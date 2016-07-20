import React, { Component } from 'react';
import BuyerItem from './BuyerItem';

export default class BuyerList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { buyers } = this.props;
    const buyerCount = buyers ? buyers.length : 0;

    return (
      <div className="buyer-list clearfix">
        { buyerCount > 0 && buyers.map(buyer =>
          <BuyerItem key={`buyer-{buyer.id}`} buyer={buyer} />
        ) }
      </div>
    );
  }
}
