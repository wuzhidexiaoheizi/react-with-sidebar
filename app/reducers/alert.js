import update from 'react-addons-update';
import {statusDescs} from '../helper';

const initalState = {
  show: false,
  title: '提示消息',
  url: '',
  message: '',
};

export default function(state = initalState, action) {
  switch (action.type) {
  case 'SHOW_ALERT': {
    return update(state, {
      show: {$set: true},
      url: {$set: action.url},
      message: {$set: statusDescs(action.status)},
    });
  }
  case 'ALERT_CLOSE': {
    return initalState;
  }
  default: return state;
  }
}
