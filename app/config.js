const DEV = {
  ONE_MONEY_ID: 1,
  API: `/api/promotions/one_money`,
  SIGNUP_URL: `http://192.168.0.171:8080/users/sign_in`,
  AUTHORIZED_PATH: `http://192.168.0.171:8080/one_money/index.html`,
  DEFAULT_AVATAR: `http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar`,
  WINNERS_NUM: 50,
};

const PRODUCTION = {
  ONE_MONEY_ID: 1,
  API: `/api/promotions/one_money`,
  SIGNUP_URL: `http://m.wanliu.biz/authorize/weixin`,
  AUTHORIZED_PATH: `http://m.wanliu.biz/one_money/2016-01-15/`,
  DEFAULT_AVATAR: `http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar`,
  WINNERS_NUM: 50,
};

export default {
  DEV,
  PRODUCTION,
};
