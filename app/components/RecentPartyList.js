import React, { Component } from 'react';
import RecentPartyItem from './RecentPartyItem';
import Constants from '../constants';

export default class RecentPartyList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { parties } = this.props;
    const { RECENTLY_PARTY_IMG } = Constants;

    return (
      <div className="recent-parties">
        {parties.length > 0 && <img src={RECENTLY_PARTY_IMG} className="recent-poster"/>}
        { parties.map(party =>
          <RecentPartyItem key={party.id} party={party} />
        ) }
      </div>
    );
  }
}
