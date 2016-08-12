import react, { Component } from 'react'; 
import { Link } from 'react-router';

export default class SideBarItem extends Component {
  constructor(props) {
    super(props);
  }

  selectItem(e) {
    e.stopPropagation();

    const { index, onChanged } = this.props;
    if (typeof onChanged == 'function') onChanged(index);
  }

  render() {
    const { title, link, selectedIndex, index } = this.props;
    const klass = selectedIndex == index ? 'active' : '';

    return (
      <div className={`sidebar-item ${klass}`} onClick={this.selectItem.bind(this)}>
        <Link to={ link } className="item-link">{ title }</Link>
      </div>
    )
  }
}
