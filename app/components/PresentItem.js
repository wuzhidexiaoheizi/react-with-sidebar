import React, { Component } from 'react';
import { extractPresentImage } from '../helper';

export default class PresentItem extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * [onClick 选择/反选礼物]
   */
  onClick() {
    const { present: { id }, selectedId, onSelectChanged } = this.props;

    if (typeof onSelectChanged == 'function') onSelectChanged(selectedId == id ? null : id);
  }

  render() {
    const { present, selectedId } = this.props;
    const {
      id,
      name,
      // title,
      price,
    } = present;
    const fee = price == 0 ? '免费' : `￥${price}`;

    const klass = selectedId == id ? 'active' : '';
    const image = extractPresentImage(name);

    return (
      <div className={`present-item ${klass}`} onClick={this.onClick.bind(this)}>
        <div className="present-image">
          <img src={image} />
        </div>
        <div className="present-fee">{fee}</div>
      </div>
    );
  }
}
