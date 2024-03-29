import React, { Component } from 'react';
import { formatDate, extractPresentAvatar } from '../helper';
import Constants from '../constants';

export default class BlessItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false,
    };
  }

  toggleEllipsisMessage() {
    const { isExpanded } = this.state;
    const { blessFigure } = this.refs;
    let className = blessFigure.className;

    if (isExpanded) {
      className = className + ' text-ellipsis';
    } else {
      const index = className.indexOf('text-ellipsis');
      className = className.slice(0, index - 1);
    }

    blessFigure.className = className;

    this.setState({ isExpanded: !isExpanded });
  }

  render() {
    const { bless } = this.props;
    const {
      message,
      created_at,
      sender: { avatar_url, nickname, login },
      virtual_present: { name },
      id,
    } = bless;

    const dateStr = formatDate(created_at, 'MM月dd日 HH:mm');
    const url = avatar_url || Constants.DEFAULT_AVATAR;
    const imageUrl = extractPresentAvatar(name);
    const donorName = nickname || login;

    return (
      <div className="bless-item" onClick={this.toggleEllipsisMessage.bind(this)}>
        <div className="benefactor-avatar">
          <img src={ url } />
        </div>
        <div className="bless-factors">
          <div className="bless-figure text-ellipsis" ref="blessFigure">
            { donorName }：<span className="bless-message">{ message }</span>
          </div>
          <div className="bless-date">{ dateStr }</div>
        </div>
        <div className="bless-gift" data-bless-id={id}>
          <img src={imageUrl} className="gift-image" />
        </div>
      </div>
    );
  }
}
