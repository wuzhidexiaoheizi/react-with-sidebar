import React, {Component} from 'react';
import {connect} from 'react-redux';

class SharePage extends Component {
  componentDidMount() {
    const itemContainer = this.refs.itemContainer;

    const width = itemContainer.offsetWidth;
    const col = Math.floor(width / 40) - (width % 40 == 0 ? 1 : 0);

    const _width = col * 40;

    itemContainer.style.width = _width + 'px';
  }

  render() {
    return (
      <div className="share-page">
        <div className="share-pic">
          <div className="share-avatar">
            <img src="http://wanliu-piano.b0.upaiyun.com/uploads/shop_category/image/b1ec8fd9fc5b559e2e96f89c61d6f900.jpg" />
          </div>
          <div className="awardee-avatar">
            <img className="awardee-pic" src="http://wanliu-piano.b0.upaiyun.com/uploads/user/image/100160/f2d8c8e64a433ae8b311292593925837.png!avatar" />
          </div>
          <div className="share-content">
            <p className="awardee-name">小黑子的获奖感言</p>
            <div className="award-testimonials">
              <div className="testimonials">
                这次很幸运能获奖，心里有说不出的高兴。好东西大家一起分享，大家也来参加吧。关注耒阳街上，好运就在等着你。
              </div>
            </div>
          </div>
        </div>
        <div className="share-product">
          <div className="share-product-pic">
            <div className="product-pic">
              <img className="product-cover" src="http://neil-img.b0.upaiyun.com/2015/03/16/fcd484f0cd0212fc48c19d14563b9c86.jpg!cover" />
              <div className="sales-border">
                <img className="sales-pic" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/73be4db79919ba98fc1f9992d5d8c4d8.jpg" />
              </div>
            </div>
            <div className="product-link">
              一元抢购查看详情
            </div>
          </div>
        </div>
        <div className="shark-like">
          <div className="share-button">
            <button className="like-btn">
              <img src="http://wanliu-piano.b0.upaiyun.com/uploads/shop_category/image/1618012d32fb4fe1ec123c38d836b503.png" />
              <span className="like-amount">56</span>
            </button>
          </div>
          <div className="share-count">
            <span className="amount">56</span>人觉得很赞
          </div>
        </div>
        <div className="share-list-container">
          <div className="share-list" ref="itemContainer">
            <div className="like-item">
              <img src="http://192.168.0.39:4000/uploads/image/a95ec1763b.jpg" />
            </div>
            <div className="like-item">
              <img src="http://192.168.0.39:4000/uploads/image/eaad3bdb44.png" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(SharePage);
