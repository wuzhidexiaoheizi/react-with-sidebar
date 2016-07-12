import React, {Component} from 'react';
import Constants from '../constants';
import { _fetch } from '../helper';
import DismissTip from '../components/DismissTip';

const WEIXIN_CONFIG = 'wexin_config';

export default class AvatarUpload extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { avatarContainer } = this.refs;
    avatarContainer.style.height = avatarContainer.clientWidth + 'px';

    if (!this.isWeixin()) return;

    const config = JSON.parse(localStorage.getItem(WEIXIN_CONFIG) || '{}');
    const isExpire = config && config.expired_at ? config.expired_at < Date.now() : true;

    if (isExpire) {
      this.getWeixinConfig();
    } else {
      this.initWeixinConfig(config);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { avatarUrl, isCurrentUser } = nextProps;
    return avatarUrl != this.props.avatarUrl || isCurrentUser != this.props.isCurrentUser;
  }

  getWeixinConfig() {
    const { DOMAIN, WEIXIN_API_SIGNATURE_URL } = Constants;
    const href = window.location.href;
    const query = `?url=${encodeURIComponent(href)}`;
    const url = `${DOMAIN}${WEIXIN_API_SIGNATURE_URL}${query}`;

    _fetch(url)
      .then(json => {
        localStorage.setItem(WEIXIN_CONFIG, JSON.stringify(json));

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
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名，见附录1
        jsApiList: WEIXIN_JS_API_LIST // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    }
  }

  handlUpload() {
    const { partyId, updateAvatarMediaId } = this.props;
    const sucCallback = this.showUploadSuccessTip.bind(this);
    const errCallback = this.showUploadErrorTip.bind(this);

    window.wx.chooseImage({
      count: 9, // 默认9
      sizeType: [ 'original', 'compressed' ], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [ 'album', 'camera' ], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        const localId = localIds[0];

        window.wx.uploadImage({
          localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: (response) => {
            const serverId = response.serverId; // 返回图片的服务器端ID
            updateAvatarMediaId(partyId, serverId, sucCallback, errCallback);
          }
        });
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
    const { avatarUrl, isCurrentUser } = this.props;
    const { DONEE_DEFAULT_AVATAR } = Constants;
    let fragment = null;
    const avatarImage = avatarUrl || DONEE_DEFAULT_AVATAR;

    if (isCurrentUser) {
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
      <div className="avatar-container" ref="avatarContainer">
        <img src={avatarImage} />
        { fragment }

        <DismissTip ref="uploadTip" />
      </div>
    );
  }
}
