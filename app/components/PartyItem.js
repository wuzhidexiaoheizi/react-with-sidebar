import React, { Component } from 'react';
import Constants from '../constants';
import { formatCurrency } from '../helper';
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
        bless_count,
        cake_id,
        id,
      },
      cakeItems,
    } = this.props;

    const cakeItem = cakeItems.find(item => item.id == cake_id) || {};
    const { DONEE_DEFAULT_AVATAR } = Constants;
    const avatar = person_avatar || DONEE_DEFAULT_AVATAR;
    const { cover_url, title } = cakeItem;
    const feedback = formatCurrency(withdrawable);

    return (
      <Link to={`/party/${id}`} className="party-link">
        <div className="party-item">
          <div className="table-col donee">
            <img src={avatar} className="donee-avatar" />
            <div className="person-name">{birthday_person}</div>
          </div>
          <div className="table-col cake">
            <img src={cover_url} className="donee-cake" />
            <div className="cake-title">{title}</div>
          </div>
          <div className="table-col withdraw">
            {feedback}
          </div>
          <div className="table-col summary">
            {bless_count}
          </div>
        </div>
      </Link>
    );
  }
}
