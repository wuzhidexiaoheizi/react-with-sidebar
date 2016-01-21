// import update from 'react-addons-update';

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
      message: '请前往订单页面领取奖励, 有效时间15分钟!',
      url: action.url,
      btn: '前往订单页面',
    };
  }

  case 'FETCH_GRAB_FAILED': {
    return {
      show: true,
      title: '抢购失败',
      message: '抢购太火爆, 要不您再试试?',
    };
  }

  case 'FETCH_GRAB_INSUFFICIENT': {
    return {
      show: true,
      title: '抢购失败',
      message: '手慢了一点点, 看看其他活动吧!'
    };
  }

  case 'ALERT_CLOSE': {
    return initalState;
  }

  default: return state;
  }
}
