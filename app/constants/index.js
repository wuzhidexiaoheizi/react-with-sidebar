export default {
  'DOMAIN': __ENV__ == 'PRODUCTION' ? 'http://test.wanliu.biz' : 'http://0.0.0.0:8080',
  'QRCODE': true,
  'WEIXIN_APP_ID': 'wx3fe5b90f6015df42',
  'WEIXIN_APP_SECRET': '56964b892658e93bfec2a6e9c2e90599',
  'WEIXIN_JS_API_LIST': ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage'],
  'API_PROMOTION_PREFIX': '/api/promotions',
  'CAKE_URL': '/cakes',
  'SALE_COUNT_URL': '/saled_count',
  'CAKE_ITEM_URL': '/api/items/%id%',
  'SHOP_URL': '/api/shops',
  'API_USER_URL': '/api/user',
  'CAKE_ORDER_URL': '/orders/buy_now_confirm',
  'PARTY_URL': '/birthday_parties',
  'BLESS_URL': '/blesses',
  'USER_SIGNIN_URL': __ENV__ == 'PRODUCTION' ? '/authorize/weixin' : '/users/sign_in',
  'VIRTUAL_PRESENT_URL': '/virtual_presents',
  'PARTY_AVATAR_UPLOAD_URL': '/upload_avatar',
  'WEIXIN_ACCESS_TOKEN_URL': 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%APPID%&secret=%APPSECRET%',
  'WEIXIN_API_TICKET_URL': 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%ACCESS_TOKEN%&type=jsapi',
  'WEIXIN_API_SIGNATURE_URL': '/api/weixin_configs',
  'DONEE_DEFAULT_AVATAR': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/c641b432732c432709730ad06d191dd9.jpg',
  'PARTY_HEADER_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/82b00396a089c4ab0705bf71d99e2754.png',
  'HEADER_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/1d1c4f398d4aa83c1a09a05c4ac68ac8.png',
  'PRESENT_HEART_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/e470299fa15eae73df92e47e2fa70d30.png',
  'PRESENT_MUSIC_BOX_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/f88d840c2793ed31d55de87f9f2336aa.png',
  'PRESENT_FLOWER_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/533cc2103adf510a449785d3f2a165ea.png',
  'PRESENT_TEDDY_BEAR_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/6883bc299b1a02e8d35dbfdde511d870.png',
  'PRESENT_MOTOR_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/760feedeeffc78e872735a4fd32d69d1.png',
  'PRESENT_CAR_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/47475ccfca33c4f885fef0e4ed53ed28.png',
  'PICK_PRESENT_LABEL_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/530ffd0245624c62fc4b30fdbb2681d2.png',
  'MESSAGE_LABEL_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/848e9cd2a86b56c3578b9de97e7e83b8.png',
  'DEFAULT_AVATAR': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar',
};
