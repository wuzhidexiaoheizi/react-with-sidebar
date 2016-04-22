import fetch from 'isomorphic-fetch';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formatTime} from '../helper';
import {_fetch} from '../helper';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_at: '',
      end_at: '',
      showArrow: true
    };
  }

  componentDidMount() {
    fetch(`${__API__}/${__ONE_MONEY_ID__}`)
    .then(res => res.json())
    .then(json => {
      this.setState({
        start_at: formatTime(Date.parse(json.start_at)),
        end_at: formatTime(Date.parse(json.end_at)),
      });
    });
  }

  onScroll(e) {
    if (e.target.scrollTop > 200) {
      this.setState({showArrow: false});
    } else {
      this.setState({showArrow: true});
    }
  }

  _handleSignup() {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const { history, location } = this.props;
    const { query } = location;
    let fromSeed = query.fromSeed;

    if (!fromSeed) {
      try {
        fromSeed = JSON.parse(localStorage.getItem('from_seed_id'));
        const expire_time = JSON.parse(localStorage.getItem('from_seed_expire_time'));
        fromSeed = expire_time >= Date.now() ? fromSeed : null;
      } catch (e) {
        console.log('error info', e);
        fromSeed = null;
      }
    }

    const q = !!fromSeed ? `?from_seed=${fromSeed}` : '';

    _fetch(`${__API__}/${__ONE_MONEY_ID__}/signup${q}`, 'put')
    .then(() => {
      history.pushState(null, '/list');
    }).catch(err => {
      if (+err.message == 401) {
        const url = `${origin}${pathname}`;
        window.location.href = __SIGNUP_URL__ + '?callback=' + encodeURIComponent(url) + '&goto_one_money=true';
      }
    });
  }


  downBtnClick() {
    const {homePage} = this.refs;
    homePage.scrollTop = homePage.scrollHeight - homePage.offsetHeight - 10;
  }

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        {this.state.showArrow && <img id="down-arrow" onClick={this.downBtnClick.bind(this)} src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/17f5c4fb9babb034ac10439036473b85.png"/>}
        <div className="page home-page" ref="homePage" onScroll={this.onScroll.bind(this)}>
          <img style={{minHeight: '400px'}} className="poster" src={__HOME_IMG__}/>
          <div className="introduction">
            <img className="introduction-top" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/8ca4d5a71c6b3e72734c6d238b5a88cf.png"/>
            <div className="introduction-text">
              <b>参与方式:</b>
              <div className="indent">关注我们的"耒阳街上"公众号之后，即可参与我们的线上抢购伊利大礼包活动</div>

              <b>抢购规则:</b>
              <div className="indent">每位关注的用户（仅限耒阳市区）只能在一次活动中抢购一件的商品，抢购的价格为一元，抢完即刻恢复正常售价</div>

              <b>商品发放:</b>
              <div className="indent">活动结束，我们将逐步发货至您填写的地址，邮费方式需货到付款</div>

              <b>活动时间:</b>
              <div className="start-end-time">
                {this.state.start_at} 至 {this.state.end_at}
              </div>
            </div>
            <img
              className="introduction-bottom"
              src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/3a4c3db9b8d16578ebd1b94b9cbcbb5b.png"
              onClick={this._handleSignup.bind(this)}
            />
          </div>
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
