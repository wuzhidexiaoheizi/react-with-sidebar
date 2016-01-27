import React, {Component} from 'react';
import {connect} from 'react-redux';

class CommentPage extends Component {
  render() {
    return (
      <div className="comment-page">
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
              <textarea className="award-comment" />
            </div>
          </div>
        </div>
        <div className="comment-scores">
          <div className="score-item description-score">
            <div className="score-field"></div>
            描述相符
          </div>
          <div className="score-item logistics-score">
            <div className="score-field"></div>
            物流服务
          </div>
          <div className="score-item servie-score">
            <div className="score-field"></div>
            服务态度
          </div>
        </div>
        <div className="comment-immediately">
          <a className="comment-btn">马上分享</a>
        </div>
      </div>
    );
  }
}

export default connect()(CommentPage);
