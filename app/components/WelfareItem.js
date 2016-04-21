import React, {Component} from 'react';

export default class WelfareItem extends Component {
  render() {
    const { given_id, status } = this.props;
    let { given_name, given_avatar_url } = this.props;

    const url = `${__DEFAULT_AVATAR__}`;
    const username = '匿名用户';
    let dom = null;
    let check = null;

    if (!given_avatar_url) given_avatar_url = url;
    if (!given_name) given_name = username;
    if ( status == 'used') {
      check = (
        <div className="check-icon">
          <img src="http://wanliu-piano.b0.upaiyun.com/uploads/shop_category/image/cc0471e660093298a8b12e86a9aff21f.png" />
        </div>
      );
    }


    if (given_id) {
      dom = (
        <div className={`given-user ${status}`}>
          <img src={given_avatar_url} className="user-avatar"/>
          {check}
        </div>
      );
    }

    return (
      <div className="welfare-item">
        {dom}
      </div>
    );
  }
}
