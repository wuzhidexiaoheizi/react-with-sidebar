import React, { Component } from 'react';
import RecentPartyItem from './RecentPartyItem';

export default class RecentPartyList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { parties } = this.props;

    return (
      <div className="recent-parties">
        { parties.map(party =>
          <RecentPartyItem key={party.id} party={party} />
        ) }
      </div>
    );
  }
}
