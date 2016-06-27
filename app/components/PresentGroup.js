import React, { Component } from 'react';
import PresentItem from './PresentItem';

export default class PresentGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      presentId: null
    };
  }

  pickItem(presentId) {
    this.setState({ presentId });

    const { onSelectChanged } = this.props;

    if (typeof onSelectChanged == 'function') onSelectChanged(presentId);
  }

  render() {
    const { presents } = this.props;

    return (
      <div className="present-group clearfix">
        { presents.map(present => <PresentItem key={present.id} present={present}
          selectedId={this.state.presentId} onSelectChanged={this.pickItem.bind(this)} />) }
      </div>
    );
  }
}
