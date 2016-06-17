import React, {Component} from 'react';
import Slider from 'uinz-slider';
import {Link} from 'react-router';

export default class PartyPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const images = ['https://img.alicdn.com/imgextra/i4/TB1q68qKXXXXXa5XVXXXXXXXXXX_!!0-item_pic.jpg_430x430q90.jpg',
      'https://img.alicdn.com/imgextra/i4/2666264280/TB2xt89pFXXXXXhXXXXXXXXXXXX_!!2666264280.jpg_430x430q90.jpg'];

    return (
      <div className="page-container review-container">
        <div className="review-nano">
          <div className="review-content">
            <div className="container">
              <div className="row">
                <div className="review-header">
                  <div className="item-posters">
                    <Slider images={images} auto />
                  </div>
                  <div className="item-detail-info">
                    <div className="media">
                      <div className="media-left media-middle">
                        <div className="sales-price">138元</div>
                        <div className="price-amount">
                          <div className="origin-price"><s>&#165;199元</s></div>
                          <span className="cashback">已返现金&#165;32元</span>
                        </div>
                      </div>
                      <div className="media-body media-middle">
                        <div className="favor-count">
                          获得30个
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
                <div className="review-body">
                  <div className="review-summary">
                    已有<span className="benefactor-count">20</span>人送出祝福
                  </div>
                  <div className="review-list">
                    <div className="review-list-header">
                      <div className="header-col">好友</div>
                      <div className="header-col">返现金额</div>
                      <div className="header-col">礼物</div>
                    </div>
                    <div className="review-list-content">
                      <div className="review-item">
                        <div className="content-col">
                          <img src={__DEFAULT_AVATAR__} className="benefactor-avatar" />
                          土豪
                        </div>
                        <div className="content-col">
                          &#165;1.00元
                        </div>
                        <div className="content-col">
                          <span className="gift-icon">红心</span>
                          X&nbsp;1
                        </div>
                      </div>

                      <div className="review-item">
                        <div className="content-col">
                          <img src={__DEFAULT_AVATAR__} className="benefactor-avatar" />
                          土豪
                        </div>
                        <div className="content-col">
                          &#165;1.00元
                        </div>
                        <div className="content-col">
                          <span className="gift-icon">红心</span>
                          X&nbsp;1
                        </div>
                      </div>

                      <div className="review-item">
                        <div className="content-col">
                          <img src={__DEFAULT_AVATAR__} className="benefactor-avatar" />
                          土豪
                        </div>
                        <div className="content-col">
                          &#165;1.00元
                        </div>
                        <div className="content-col">
                          <span className="gift-icon">红心</span>
                          X&nbsp;1
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="review-footer">
          <div className="container">
            <div className="row">
              <Link to="/party">
                <div className="goto-party">返回生日趴</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
