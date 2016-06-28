import React, { Component } from 'react';
import { extractPresentAvatar } from '../helper';
import Constants from '../constants';

export default class ReviewItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { bless } = this.props;
    const {
      sender: { avatar_url, login },
      virtual_present: { name },
    } = bless;

    const imageAvatar = extractPresentAvatar(name);
    const url = avatar_url || Constants.DEFAULT_AVATAR;

    return (
      <div className="review-item">
        <div className="content-col">
          <img src={url} className="benefactor-avatar" />
          { login }
        </div>
        <div className="content-col">
          &#165;1.00元
        </div>
        <div className="content-col">
          <img className="gift-icon" src={imageAvatar} />
          X&nbsp;1
        </div>
      </div>
    );
  }
}
