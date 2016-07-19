import React, { Component } from 'react';
import PartyItem from './PartyItem';

export default class PartyList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { parties, cakeItems } = this.props;
    const { length } = parties;

    return (
      <div className="party-list">
        <div className="party-table">
          <div className="party-table-header">
            <div className="table-col donee">受赠者</div>
            <div className="table-col cake">受赠蛋糕</div>
            <div className="table-col withdraw">返现金额</div>
            <div className="table-col summary">礼品总数</div>
          </div>
          <div className="party-table-body">
            {!length && <div className="empty-list">暂无生日趴</div>}
            {parties.map(party => <PartyItem key={party.id} party={party} cakeItems={cakeItems}/>)}
          </div>
        </div>
      </div>
    );
  }
}
