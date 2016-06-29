import React, {Component} from 'react';
import Constants from '../constants';
import { _fetch } from '../helper';
import DismissTip from '../components/DismissTip';

const WEIXIN_CONFIG = 'wexin_config';
const WEIXIN_CONFIG_EXPIRE = 'wexin_config_expire';

export default class AvatarUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      couldUpload: false
    };
  }

  componentDidMount() {
    if (!this.isWeixin()) return;

    const config = localStorage.getItem(WEIXIN_CONFIG);
    const expireTime = localStorage.getItem(WEIXIN_CONFIG_EXPIRE);
    const isExpire = config && expireTime ? expireTime < Date.now() : true;

    if (isExpire) {
      this.getWeixinConfig();
    } else {
      this.initWeixinConfig(config);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser, createUserId } = nextProps;

    this.setState({ couldUpload: currentUser && currentUser.id == createUserId });
  }

  onSubmit(e) {
    e.preventDefault();
  }

  getWeixinConfig() {
    const { DOMAIN, WEIXIN_API_SIGNATURE_URL } = Constants;
    const href = window.location.href;
    // const index = href.indexOf('#');
    // if (index > -1) href = href.slice(0, index);
    const query = `?url=${encodeURIComponent(href)}`;
    const url = `${DOMAIN}${WEIXIN_API_SIGNATURE_URL}${query}`;

    _fetch(url)
      .then(json => {
        localStorage.setItem(WEIXIN_CONFIG, json);
        localStorage.setItem(WEIXIN_CONFIG_EXPIRE, Date.now() + 7200);

        this.initWeixinConfig(json);
      });
  }

  isWeixin() {
    const ua = window.navigator.userAgent.toLowerCase();

    return ua.match(/MicroMessenger/i) == 'micromessenger';
  }

  initWeixinConfig(config) {
    const { appId, timestamp, nonceStr, signature} = config;
    const { WEIXIN_JS_API_LIST } = Constants;

    if (window.wx) {
      window.wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名，见附录1
        jsApiList: WEIXIN_JS_API_LIST // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    }
  }

  handlUpload() {
    window.wx.chooseImage({
      count: 9, // 默认9
      sizeType: [ 'original', 'compressed' ], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [ 'album', 'camera' ], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        console.log(localIds);
      }
    });
  }

  handleFileChange(e) {
    e.preventDefault();

    const { avatarInput } = this.refs;
    const form = new FormData();
    form.append('birthday_party[person_avatar]', avatarInput.files[0]);
    form.append('_method', 'PATCH');

    const { partyId, uploadPartyAvatar } = this.props;
    uploadPartyAvatar(partyId, form, this.showUploadSuccessTip.bind(this), this.showUploadErrorTip.bind(this));
  }

  showUploadSuccessTip() {
    const { uploadTip } = this.refs;

    uploadTip.resetTypeAndMessage('success', '头像上传成功！');
  }

  showUploadErrorTip(errors) {
    const { uploadTip } = this.refs;

    uploadTip.resetTypeAndMessage('error', errors);
  }

  render() {
    const { DONEE_DEFAULT_AVATAR } = Constants;
    const { avatar_url } = this.props;
    const { couldUpload } = this.state;
    const avatar_image = avatar_url || DONEE_DEFAULT_AVATAR;
    let fragment = null;

    if (couldUpload) {
      if (this.isWeixin()) {
        fragment = (<div className="image-area" onClick={this.handlUpload.bind(this)}></div>);
      } else {
        fragment = (
          <input type="file" className="avatar-input" ref="avatarInput"
            onChange={this.handleFileChange.bind(this)} name="file"/>
        );
      }
    }

    return (
      <div className="avatar-container">
        <img src={avatar_image} />
        { fragment }

        <DismissTip ref="uploadTip" />
      </div>
    );
  }
}
