// import update from 'react-addons-update';
import {statusDescs} from '../helper';

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
      message: statusDescs(action.status),
    };
  }

  case 'SUBMIT_COMMENT_FAILED': {
    if (action.evaluation_id) {
      return {
        show: true,
        title: '评论失败',
        btn: '查看评论',
        historyUrl: `/share/${action.evaluation_id}`,
        message: action.message,
      };
    }
    return {
      show: true,
      title: '评论失败',
      message: action.message,
    };
  }

  case 'THUMB_FAILED': {
    return {
      show: true,
      title: '点赞失败',
      message: action.message,
    };
  }

  case 'NOT_SIGN_UP': {
    return {
      show: true,
      title: '未登陆',
      message: '请登陆之后, <br/>再进行操作.',
      url: __SIGNUP_URL__ + '?callback=' + encodeURIComponent(`${location.origin + location.pathname}${action.pathHash || '#/list'}`) + '&goto_one_money=true',
      btn: '使用微信登陆',
    };
  }

  case 'UNKNOW_ERROR': {
    return {
      show: true,
      title: '未知错误',
      message: action.message,
    };
  }

  case 'ALERT_CLOSE': {
    return initalState;
  }

  default: return state;
  }
}
