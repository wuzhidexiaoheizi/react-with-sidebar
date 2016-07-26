export default {
  'DOMAIN': __ENV__ == 'PRODUCTION' ? 'http://m.wanliu.biz' : 'http://0.0.0.0:8080',
  'QRCODE': true,
  'WEIXIN_JS_API_LIST': ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'onMenuShareAppMessage', 'onMenuShareTimeline'],
  'API_PROMOTION_PREFIX': '/api/promotions',
  'CAKE_URL': '/cakes',
  'SALE_COUNT_URL': '/saled_count',
  'CAKE_ITEM_URL': '/api/items/%id%',
  'SHOP_URL': '/api/shops',
  'API_USER_URL': '/api/user',
  'CAKE_ORDER_URL': '/orders/buy_now_confirm',
  'PARTY_URL': '/birthday_parties',
  'BLESS_URL': '/blesses',
  'PARTY_RANK_URL': '/rank',
  'RECENTLY_PARTIES_URL': '/recently',
  'UPDATE_AVATAR_URL': 'update_avatar_media_id',
  'USER_SIGNIN_URL': __ENV__ == 'PRODUCTION' ? '/authorize/weixin' : '/users/sign_in',
  'VIRTUAL_PRESENT_URL': '/virtual_presents',
  'PARTY_AVATAR_UPLOAD_URL': '/upload_avatar',
  'MINE_LAUCHED_PARTY_URL': '/birthday_parties',
  'MINE_ATTEND_PARTY_URL': '/birthday_parties/blessed',
  'CHECK_PRESENT_EXIST': '/existPresent',
  'WEIXIN_ACCESS_TOKEN_URL': 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%APPID%&secret=%APPSECRET%',
  'WEIXIN_API_TICKET_URL': 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%ACCESS_TOKEN%&type=jsapi',
  'WEIXIN_API_SIGNATURE_URL': '/api/weixin_configs',
  'DONEE_DEFAULT_AVATAR': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/8b0228171d41b841b3a96e86c3eeb4b0.jpg',
  'PARTY_HEADER_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/82b00396a089c4ab0705bf71d99e2754.png',
  'HEADER_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/066a1063a4ca7c4225503f5de922c6c8.png',
  'BLESS_HEADER_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/ca4cd3b9d0f049d5c6bb15fd50c1c176.jpg',
  'PRESENT_HEART_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/e470299fa15eae73df92e47e2fa70d30.png',
  'PRESENT_MUSIC_BOX_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/d57de4dd46a47e3459d80311d53b304f.png',
  'PRESENT_FLOWER_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/533cc2103adf510a449785d3f2a165ea.png',
  'PRESENT_PLEASANT_SHEEP_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/54ac96ba1acbae1b9c1d76ed48ee58fe.png',
  'PRESENT_ULTRAMAN_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/829119b2b6f86ceb2fc5cbd676da5d1c.png',
  'PRESENT_BOONIE_BEAR_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/89b6d0de421cb622dbcc6cbdd4b941f0.png',
  'PRESENT_TEDDY_BEAR_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/6883bc299b1a02e8d35dbfdde511d870.png',
  'PRESENT_MOTOR_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/760feedeeffc78e872735a4fd32d69d1.png',
  'PRESENT_CAR_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/47475ccfca33c4f885fef0e4ed53ed28.png',
  'PICK_PRESENT_LABEL_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/530ffd0245624c62fc4b30fdbb2681d2.png',
  'MESSAGE_LABEL_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/102/848e9cd2a86b56c3578b9de97e7e83b8.png',
  'DEFAULT_AVATAR': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar',
  'ENVELOPE_SM_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/f2d9972f17bef067b7743dcfd418f0ed.png',
  'ENVELOPE_LG_LIGHT_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/076a5ff4c1f8e6d6bf959dfbf6ef5646.png',
  'ENVELOPE_LG_GRAY_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/2e307331f7a19c459181ebac83ffa3dc.png',
  'UNREAD_GIFT_ICON': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/a37b5f562024d238875a8b3a6005789e.png!cover',
  'RANK_HEADER_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/5908419ebe8e65632954b7203de6b5b6.png',
  'RECENTLY_PARTY_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/19ff986a7fb16b8bc719f4e86f0023b5.png',
  'CAKE_LIST_IMG': 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/198/6e11f7038856d92d4f140d7c73dd3079.png',
};
