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
      <div className="bless-container">
        { blesses.length > 0 &&
          <div className="bless-list">
            { blesses.map(bless => <BlessItem key={bless.id} bless={bless} />) }
          </div>
        }
      </div>
    );
  }
}
