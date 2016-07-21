import React, { Component } from 'react';
import Constants from '../constants';
import { getRankImage, zeroize } from '../helper';
import { Link } from 'react-router';

export default class PartyItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      party: {
        birthday_person,
        person_avatar,
        withdrawable,
        id,
        gnh,
      },
      rankIndex,
    } = this.props;

    const { DONEE_DEFAULT_AVATAR } = Constants;
    const avatar = person_avatar || DONEE_DEFAULT_AVATAR;
    const image = getRankImage(rankIndex);

    let fragment;

    if (image) {
      // fragment = (<img src={image} />);
      fragment = '04';
    } else {
      fragment = zeroize(rankIndex + 1);
    }

    return (
      <Link to={`/party/${id}`} className="party-link">
        <div className="party-item">
          <div className="table-col rank">
            { fragment }
          </div>
          <div className="table-col brief">
            <img src={avatar} className="donee-avatar" />
            <div className="other">
              <div className="donee-name text-ellipsis">{birthday_person}</div>
              <div className="withdraw">
                获得红包
                <span className="amt">￥{withdrawable}</span>
              </div>
            </div>
          </div>
          <div className="table-col gnh">
            <div className="gnh-card">
              <div className="gnh-title">幸福指数</div>
              <div className="gnh-value">{gnh}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}
