import React, { Component } from 'react';
import { extractPresentAvatar } from '../helper';

export default class GiftItem extends Component {
  constructor(props) {
    super(props);
  }

  handleGiftClick() {
    const { onShowAnimation } = this.props;
    const { bless: { virtual_present: { name }, sender: { nickname, login } } } = this.props;

    if (typeof onShowAnimation == 'function') onShowAnimation(nickname || login, name);
  }

  render() {
    const { bless: { virtual_present: { name } } } = this.props;
    const imageAvatar = extractPresentAvatar(name);

    return (
      <div className="gift-item" onClick={ this.handleGiftClick.bind(this) }>
        <img src={imageAvatar} className="gift-avatar" />
      </div>
    );
  }
}
