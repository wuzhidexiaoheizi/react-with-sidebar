import React, { Component } from 'react';
import SideBarGroup from './SideBarGroup';

export default class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroupIndex: 0
    };
  }

  pickGroup(groupIndex) {
    this.setState({ selectedGroupIndex: groupIndex });
  }

  render() {
    const { menus } = this.props;
    const { selectedGroupIndex } = this.state;

    return (
      <div className="sidebar-menu">
        { menus.map((menu, index) =>
          <SideBarGroup key={index}
          menu={menu}
          groupIndex={index}
          selectedGroupIndex={selectedGroupIndex}
          changeGroup={this.pickGroup.bind(this)}
          />)
        }
      </div>
    );
  }
}
