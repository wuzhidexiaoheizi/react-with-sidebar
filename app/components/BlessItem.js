import React, { Component } from 'react';
import { formatDate, extractPresentAvatar } from '../helper';
import Constants from '../constants';

export default class BlessItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { bless } = this.props;
    const {
      message,
      created_at,
      sender: { avatar_url, login },
      virtual_present: { name },
    } = bless;

    const dateStr = formatDate(created_at, 'yyyy年MM月dd日 HH:mm');
    const url = avatar_url || Constants.DEFAULT_AVATAR;
    const imageUrl = extractPresentAvatar(name);

    return (
      <div className="bless-item">
        <div className="benefactor-avatar">
          <img src={ url } />
        </div>
        <div className="bless-factors">
          <div className="bless-figure text-ellipsis">
            { login }：<span className="bless-message">{ message }</span>
          </div>
          <div className="bless-date">{ dateStr }</div>
        </div>
        <div className="bless-gift">
          <img src={imageUrl} className="gift-image" />
        </div>
      </div>
    );
  }
}
