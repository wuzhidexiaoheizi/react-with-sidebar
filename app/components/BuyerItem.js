import React, { Component } from 'react';
import { Link } from 'react-router';

export default class BuyerList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { buyer: { avatar_url, nickname, login, party_id } } = this.props;
    const name = nickname || login;

    return (
      <Link to={`/party/${party_id}`}>
        <div className="buyer-item">
          <img src={avatar_url} title={name} />
        </div>
      </Link>
    );
  }
}
