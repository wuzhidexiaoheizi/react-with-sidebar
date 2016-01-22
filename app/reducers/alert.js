// import update from 'react-addons-update';
import config from '../config.js';
const {ONE_MONEY_PATH, SIGNUP_URL} = config[__ENV__];

const initalState = {
  show: false,
  title: '',
  message: '',
  type: '',
  url: '',
  btn: ''
};

export default function(state = initalState, action) {
  switch (action.type) {
  case 'FETCH_GRAB_SUCCESS': {
    return {
      show: true,
      title: '抢购成功',
      message: '请前往订单页面领取奖励,<br/>有效时间15分钟!',
      url: action.url,
      btn: '前往订单页面',
    };
  }

  case 'FETCH_GRAB_FAILED': {
    return {
      show: true,
      title: '抢购失败',
      message: '抢购太火爆, <br/>出现了未知错误,<br/>要不您再试试?',
    };
  }

  case 'FETCH_GRAB_INSUFFICIENT': {
    return {
      show: true,
      title: '抢购失败',
      message: '手慢了一点点, <br/>被其他小伙伴抢光了.<br/>快去看看其他活动吧!'
    };
  }

  case 'NOT_SIGN_UP': {
    return {
      show: true,
      title: '未登陆',
      message: '如果您不登陆的话, <br/>就无法参加活动.',
      url: SIGNUP_URL + '?callback=' + encodeURIComponent(`${ONE_MONEY_PATH}#/list`) + '&goto_one_money=true',
      btn: '使用微信登陆',
    };
  }

  case 'ALERT_CLOSE': {
    return initalState;
  }

  default: return state;
  }
}
