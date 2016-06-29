import React, { Component } from 'react';
import ReviewItem from './ReviewItem';

export default class BlessGroup extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.blesses != this.props.blesses;
  }

  render() {
    const {blesses} = this.props;
    const keyPrefix = `review-${Date.now()}`;

    return (
      <div className="review-list-content">
        { blesses.map(bless => <ReviewItem key={`${keyPrefix}-${bless.id}`} bless={bless} />) }
      </div>
    );
  }
}
