import React, { Component } from 'react';
import { extractPresentAvatar } from '../helper';

export default class GiftItem extends Component {
  constructor(props) {
    super(props);
  }

  handleGiftClick() {
    const { onShowAnimation } = this.props;
    const { bless: { virtual_present: name }} = this.props;
    const anim_name = name.name;
    if (typeof onShowAnimation == 'function') onShowAnimation(anim_name);
  }

  render() {
    const { bless: { type } } = this.props;
    const imageAvatar = extractPresentAvatar(type);

    return (
      <div className="gift-item" onClick={ this.handleGiftClick.bind(this) }>
        <img src={imageAvatar} className="gift-avatar" />
      </div>
    );
  }
}
