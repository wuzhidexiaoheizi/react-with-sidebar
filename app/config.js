const HOST = ``;

const config = {
  DEV: {
    API: `${HOST}/api/promotions/one_money`,
    ONE_MONEY_ID: 1,
    SIGNUP_URL: `${HOST}/authorize/weixin`,
    DEFAULT_AVATAR: `http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar`,
    AUTHORIZED_PATH: `http://192.168.0.161:8080`
  },

  PRODUCTION: {
    API: `${HOST}/api/promotions/one_money`,
    ONE_MONEY_ID: 1,
    SIGNUP_URL: `${HOST}/authorize/weixin`,
    DEFAULT_AVATAR: `http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar`,
    AUTHORIZED_PATH: `${HOST}/one_money/2016-01-15/`
  }
};

export default config;
