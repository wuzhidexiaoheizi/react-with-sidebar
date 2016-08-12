import React, { Component } from 'react';
import { Link } from 'react-router';
import SideBarItem from './SideBarItem';

export default class SideBarGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: null
    };
  }

  pickItem(index) {
    this.setState({ selectedIndex: index });
    const { groupIndex, pickGroup } = this.props;
    if (typeof pickGroup == 'function') pickGroup(groupIndex);
  }

  render() {
    const { menu: { title, link, children, selectedGroupIndex, groupIndex } } = this.props;
    const klass = groupIndex == selectedGroupIndex ? 'open' : '';
    const { selectedIndex } = this.state;
    const length = children ? children.length : 0;
    let fragment = null;

    if (length) {
      fragment = (
        <div className="sub-group">
          <div className="group-title">{title}</div>
          <div className="group-item">
            { children.map((item, index) =>
              <SideBarItem {...item}
                key={index}
                index={index}
                selectedIndex={selectedIndex}
                onChanged={this.pickItem.bind(this)}
              />
            )}
          </div>
        </div>
      );
    } else {
      fragment = (<Link to={link} className="item-link">{title}</Link>);
    }

    return (
      <div className={`sidebar-group ${klass}`}>
        {fragment}
      </div>
    );
  }
}
