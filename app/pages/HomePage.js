import React, {Component} from 'react';
import {connect} from 'react-redux';
import config from '../config.js';

const {SIGNUP_URL} = config[__ENV__];


class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  _handleSignup() {
    const url = `${location.origin + location.pathname}#/list`;
    location.href = SIGNUP_URL + '?callback=' + encodeURIComponent(url) + '&goto_one_money=true';
  }

  render() {
    return (
      <div className="page home-page">
        <img className="poster" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/3c6e051086bc13b4fccca045a3efe187.jpg"/>
        <div className="introduction">
          <img className="introduction-top" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/8ca4d5a71c6b3e72734c6d238b5a88cf.png"/>
          <main className="introduction-text">
            <b>参与方式:</b>
            <div className="indent">关注我们的"耒阳街上"公众号之后，即可参与我们的线上抢购伊利大礼包活动</div>

            <b>抢购规则:</b>
            <div className="indent">每位关注的用户（仅限耒阳市区）只能在一次活动中抢购一件的商品，抢购的价格为一元，抢完即刻恢复正常售价</div>

            <b>商品发放:</b>
            <div className="indent">活动结束，我们将逐步发货至您填写的地址，邮费方式需货到付款</div>

            <b>活动时间:</b>
            <div className="indent start-end-time"></div>
          </main>
          <img
            className="introduction-bottom"
            src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/3a4c3db9b8d16578ebd1b94b9cbcbb5b.png"
            onClick={this._handleSignup.bind(this)}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    home: state.home
  };
}

export default connect(mapStateToProps)(HomePage);
