import React, { Component } from 'react';
import { extractPresentAvatar } from '../helper';

export default class GiftItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { bless: { type } } = this.props;
    const imageAvatar = extractPresentAvatar(type);

    return (
      <div className="gift-item">
        <img src={imageAvatar} className="gift-avatar" />
      </div>
    );
  }
}
