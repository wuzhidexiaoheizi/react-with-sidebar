import React, { Component } from 'react';
import GiftItem from './GiftItem';

export default class GiftGroup extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.blesses != this.props.blesses;
  }

  render() {
    const { blesses } = this.props;

    return (
      <div className="gift-group">
        { blesses.length > 0 &&
          <div className="gift-wrap">
            <div className="gift-desc">已收到的礼物（点击可播放动画）</div>
            <div className="gift-list">
              { blesses.map(bless =>
                <GiftItem key={bless.id} bless={bless} />
              ) }
            </div>
          </div>
        }
      </div>
    );
  }
}
