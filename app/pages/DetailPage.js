import React, {Component} from 'react';
import Slider from 'uinz-slider';
import {Link} from 'react-router';

class DetailPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const images = ['https://img.alicdn.com/imgextra/i4/TB1q68qKXXXXXa5XVXXXXXXXXXX_!!0-item_pic.jpg_430x430q90.jpg',
      'https://img.alicdn.com/imgextra/i4/2666264280/TB2xt89pFXXXXXhXXXXXXXXXXXX_!!2666264280.jpg_430x430q90.jpg'];

    return (
      <div className="page-container detail-container">
        <div className="container-nano">
          <div className="container-content">
            <div className="container">
              <div className="row">
                <div className="detail-header">
                  <div className="detail-posters">
                    <Slider images={images} auto />
                  </div>
                  <div className="item-detail-info">
                    <div className="media">
                      <div className="media-left media-middle">
                        <div className="sales-price">138元</div>
                        <div className="price-amount">
                          <div className="origin-price"><s>&#165;199元</s></div>
                          <span className="saled-count">已售100件</span>
                        </div>
                      </div>
                      <div className="media-body media-middle">
                        <div className="favor-count">
                          赠30个返现红心
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item-brief">
                    <div className="media">
                      <div className="media-left media-middle">
                        <div className="item-title two-line-ellipsis">
                          父亲节预定北京广州深圳上海重庆水果生日蛋糕店同城速递全国配送
                        </div>
                      </div>
                      <div className="media-body media-middle">
                        <p className="align-center">库存</p>
                        <p className="align-center">50</p>
                      </div>
                      <div className="media-right media-middle">
                        <p className="align-center">已参与</p>
                        <p className="align-center">15</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="detail-body">
                  <div className="winner-container">
                    <div className="winner-summary">已有<span className="winner-count">15</span>人成功购买</div>
                    <div className="winner-list">
                      <div className="winner">
                        <img src={__DEFAULT_AVATAR__} />
                      </div>
                      <div className="winner">
                        <img src={__DEFAULT_AVATAR__} />
                      </div>
                    </div>
                  </div>
                  <div className="supplier-container">
                    <div className="shop-logo">
                      <img src={__DEFAULT_AVATAR__} />
                    </div>
                    <div className="shop-sev">
                      <p className="shop-info">
                        供应商:&nbsp;耒阳街上
                      </p>
                      <p className="slogan text-ellipsis">
                        地址:&nbsp;湖南省长沙市黄兴路步行街1002-35
                      </p>
                      <p className="shop-favorites">
                        <span className="favorite-amount">关注:
                          <span className="fav-count">100</span>
                        </span>
                        <span className="fav-btn">
                          <i className="fa fa-plus"></i>
                          <span className="fav-text">关注</span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="item-description">
                    商品详情
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-footer detail-actions">
          <div className="container">
            <div className="row">
              <Link to="/party">
                <div className="buy-now">
                  立即抢购
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailPage;
