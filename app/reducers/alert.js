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
  case 'FETCH_GRAB_DONE': {
    const {title, message, url, btn} = action;
    return {show: true, title, url, message, btn};
  }

  case 'ALERT_CLOSE': {
    return initalState;
  }

  default: return state;
  }
}
