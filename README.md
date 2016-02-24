耒阳街上一元购活动页面

## How to use
  - 安装依赖
```bash
$ npm install
```
  - 运行开发环境
```bash
$ npm start
```

  - 生产模式
```bash
$ npm run deploy
```

###常用修改:
`webpack.production.config.js`文件
```
var config = {
  __ENV__           : JSON.stringify('PRODUCTION'),
  __ONE_MONEY_ID__  : JSON.stringify(26),
  __WINNERS_NUM__   : JSON.stringify(50),
  __API__           : JSON.stringify('/api/promotions/one_money'),
  __SIGNUP_URL__    : JSON.stringify('http://m.wanliu.biz/authorize/weixin'),
  __DEFAULT_AVATAR__: JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar'),
  __DR_CODE__       : JSON.stringify(true),
  __HOME_IMG__      : JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/bce4aa071456342d64e7a4d5da3cb45d.jpg'),
  __LIST_IMG__      : JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/ac32369464ed4b3017013080d2c6c78b.jpg')
};
```
|KEY              |FUNCTON               |
|:---------------:|:--------------------:|
|__ONE_MONEY_ID__ |活动ID号              |
|__WINNERS_NUM__  |幸运用户显示数量      |
|__DR_CODE__      |是否显示二维码        |
|__HOME_IMG__     |首页第*期图片地址     |
|__LIST_IMG__     |列表页面第*期图片地址 |
