import React, {Component} from 'react';
import {Link} from 'react-router';
import StatusBar from './StatusBar';
import {getStatus} from '../helper';

export default class extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {id, fetchCallback} = this.props;
    fetchCallback(id);
    this.interval = setInterval(() => {
      const {status, updateItemStatus} = this.props;
      const _status = getStatus(this.props);
      if (_status != status) updateItemStatus(id, _status);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  priceLogo() {
    const {price} = this.props;
    if (price == 1) return <img className="price-logo" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/a329beccdfd82a9ef1cf20c0f4e7bbb4.jpg"/>;
    if (price == 3) return <img className="price-logo" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/71f425ddfda4f14ed54edec3d6edb0f5.png"/>;
    if (price == 5) return <img className="price-logo" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/543d1f60de9220e69d15b1260e66b4cf.jpg"/>;
    if (price == 10) return <img className="price-logo" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/427038b84edf7ff904fa572ad61f2048.jpg"/>;
    return null;
  }

  render() {
    const {title, cover_urls, price, ori_price, id, status} = this.props;
    return (
      <li className="item">
        <Link to={`/detail/${id}`}>
          <div className="left">
            {this.priceLogo()}
            <img className="avatar" src={cover_urls[0]}/>
          </div>
          <div className="right">
            <h3 className="title">{title}</h3>
              <span className="price">￥{price}</span>
              <span className="ori_price">原价:<s>{ori_price}</s></span>
            <StatusBar status={status}/>
          </div>
        </Link>
      </li>
    );
  }
}
