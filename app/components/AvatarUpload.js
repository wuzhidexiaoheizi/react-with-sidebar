import React, {Component} from 'react';
import Constants from '../constants';
import DismissTip from '../prototypes/DismissTip';

export default class AvatarUpload extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.resizeAvatarContainer();

    this.resizeHandler = this.resizeAvatarContainer.bind(this);
    window.addEventListener('resize', this.resizeHandler, false);
  }

  componetWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler, false);
  }

  resizeAvatarContainer() {
    const { avatarContainer } = this.refs;

    if (avatarContainer) avatarContainer.style.height = avatarContainer.clientWidth + 'px';
  }

  isWeixin() {
    const ua = window.navigator.userAgent.toLowerCase();

    return ua.match(/MicroMessenger/i) == 'micromessenger';
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
    const { avatarContainer } = this.refs;

    /*eslint-disable */
    new DismissTip(avatarContainer, 'success', '头像上传成功！');
    /*eslint-enable */
  }

  showUploadErrorTip(errors) {
    const { avatarContainer } = this.refs;

    /*eslint-disable */
    new DismissTip(avatarContainer, 'error', errors);
    /*eslint-enable */
  }

  showGifts() {
    const { showAnimations } = this.props;

    if (typeof showAnimations == 'function') showAnimations();
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
    } else {
      fragment = (<div className="image-area" onClick={this.showGifts.bind(this)}></div>);
    }

    return (
      <div className="avatar-container" ref="avatarContainer">
        <img src={avatarImage} />
        { fragment }
      </div>
    );
  }
}
