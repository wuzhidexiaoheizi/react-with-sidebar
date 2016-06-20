import React, {Component} from 'react';
import DRCode from '../components/DRCode';
import {Link} from 'react-router';

class ListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDRText: false
    };
  }

  onScroll(e) {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if (scrollTop + offsetHeight == scrollHeight) {
      this.setState({showDRText: true});
    } else {
      this.setState({showDRText: false});
    }
  }

  render() {
    return (
      <div className="page-container list-container">
        <div className="container">
          <div className="row">
            {__QR_CODE__ && <DRCode showText={this.state.showDRText}/>}
          </div>
        </div>

        <div className="list-page-container" onScroll={this.onScroll.bind(this)}>
          <div className="list-page" ref="list-page">
            <div className="container">
              <div className="row">
                <img className="list-poster" src={__LIST_IMG__}/>
                <ul className="cake-list">
                  <li className="cake-item">
                    <Link to="/detail" className="link">
                      <div className="row">
                        <div className="col-xs-5">
                          <img className="item-pic" src="https://img.alicdn.com/imgextra/i4/TB1q68qKXXXXXa5XVXXXXXXXXXX_!!0-item_pic.jpg_430x430q90.jpg" />
                        </div>
                        <div className="col-xs-7">
                          <div className="item-title">
                            父亲节预定北京广州深圳上海重庆水果生日蛋糕店同城速递全国配送
                          </div>
                          <div className="item-price">
                            <span className="price">&#165;138元</span>
                            <span className="ori_price">原价:<s>&#165;199元</s></span>
                          </div>
                          <div className="donee-count">
                            获得30次返现红心
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="cake-item">
                    <Link to="/detail" className="link">
                      <div className="row">
                        <div className="col-xs-5">
                          <img className="item-pic" src="https://img.alicdn.com/imgextra/i4/TB1q68qKXXXXXa5XVXXXXXXXXXX_!!0-item_pic.jpg_430x430q90.jpg" />
                        </div>
                        <div className="col-xs-7">
                          <div className="item-title">
                            父亲节预定北京广州深圳上海重庆水果生日蛋糕店同城速递全国配送
                          </div>
                          <div className="item-price">
                            <span className="price">&#165;138元</span>
                            <span className="ori_price">原价:<s>&#165;199元</s></span>
                          </div>
                          <div className="donee-count">
                            获得30次返现红心
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="cake-item">
                    <Link to="/detail" className="link">
                      <div className="row">
                        <div className="col-xs-5">
                          <img className="item-pic" src="https://img.alicdn.com/imgextra/i4/TB1q68qKXXXXXa5XVXXXXXXXXXX_!!0-item_pic.jpg_430x430q90.jpg" />
                        </div>
                        <div className="col-xs-7">
                          <div className="item-title">
                            父亲节预定北京广州深圳上海重庆水果生日蛋糕店同城速递全国配送
                          </div>
                          <div className="item-price">
                            <span className="price">&#165;138元</span>
                            <span className="ori_price">原价:<s>&#165;199元</s></span>
                          </div>
                          <div className="donee-count">
                            获得30次返现红心
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListPage;
