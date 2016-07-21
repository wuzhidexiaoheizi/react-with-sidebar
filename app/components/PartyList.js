import React, { Component } from 'react';
import PartyItem from './PartyItem';

export default class PartyList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { parties } = this.props;
    const { length } = parties;

    return (
      <div className="party-list">
        { !length && <div className="empty-list">暂无生日趴</div> }
        { parties.map((party, index) =>
          <PartyItem key={party.id} party={party} rankIndex={index} />
        )}
      </div>
    );
  }
}
