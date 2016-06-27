import React, { Component } from 'react';
import BlessItem from './BlessItem';

export default class BlessGroup extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.blesses != this.props.blesses;
  }

  render() {
    const {blesses} = this.props;

    return (
      <div className="bless-list">
        { blesses.map(bless => <BlessItem key={`party-${Date.now()}-${bless.id}`} bless={bless} />) }
      </div>
    );
  }
}
