import React, { Component } from 'react';
import Constants from '../constants';
import { Link } from 'react-router';

export default class RecentPartyItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { party } = this.props;
    const {
      birthday_person,
      person_avatar,
      withdrawable,
      gnh,
      id,
      heart_count,
      hearts_limit,
    } = party;

    const { DONEE_DEFAULT_AVATAR } = Constants;
    const avatar = person_avatar || DONEE_DEFAULT_AVATAR;
    const percent = Math.floor(heart_count / hearts_limit * 100);

    return (
      <Link to={`/party/${id}`} className="party-link">
        <div className="item-wrap">
          <div className="recent-item">
            <div className="table-col brief">
              <img src={avatar} className="donee-avatar" />
            </div>
            <div className="table-col other">
              <div className="donee-name text-ellipsis">{birthday_person}</div>
              <div className="withdraw">
                获得红包
                <span className="amt">￥{withdrawable}</span>
              </div>
            </div>
            <div className="table-col gnh">
              <div className="gnh-card">
                <div className="gnh-title">幸福指数</div>
                <div className="gnh-value">{gnh}</div>
              </div>
            </div>
          </div>
          <div className="progress">
            <div className="progress-bar progress-bar-danger"
              style={{ width: `${percent}%` }}></div>
          </div>
        </div>
      </Link>
    );
  }
}
