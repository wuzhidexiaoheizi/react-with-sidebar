import React, { Component } from 'react';
import Constants from '../constants';
import BlessPhase from '../components/BlessPhase';
import BlessDistribute from '../components/BlessDistribute';
import { fetchParty } from '../actions/party';
import { fetchBlessList } from '../actions/bless';
import { fetchCurrentUser } from '../actions/user';
import { connect } from 'react-redux';
import { formatDate } from '../helper';
import { bindActionCreators } from 'redux';
import * as PartyActions from '../actions/party';
import * as PresentActions from '../actions/virtualPresent';
import * as BlessActions from '../actions/bless';
import BlessGroup from '../components/BlessGroup';
import Loading from 'halogen/ScaleLoader';
import AvatarUpload from '../components/AvatarUpload';

class PartyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPhaseModal: false,
      blessPer: 10,
    };
  }

  componentDidMount() {
    const { params: {id}, dispatch } = this.props;
    const { blessPer } = this.state;

    dispatch(fetchCurrentUser());
    dispatch(fetchParty(id));
    dispatch(fetchBlessList(id, '', blessPer));
  }

  componentWillReceiveProps() {
    if (window.location.href.indexOf('#showDistribute') > -1) {
      const blessDistribute = this.refs.blessDistribute;

      if (blessDistribute) blessDistribute.show();
    }
  }

  openPhaseModal() {
    this.setState({ showPhaseModal: true });
  }

  openPresentModal() {
    const blessDistribute = this.refs.blessDistribute;

    if (blessDistribute) blessDistribute.show();
  }

  closePhaseModal() {
    this.setState({ showPhaseModal: false });
  }

  closePresentModal() {
    const blessDistribute = this.refs.blessDistribute;

    if (blessDistribute) blessDistribute.hide();
  }

  handleScroll(e) {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if (scrollTop + offsetHeight == scrollHeight) {
      this.loadNextPageBlesses();
    }
  }

  loadNextPageBlesses() {
    const { bless: { listFetching, earliestId } } = this.props;

    if (listFetching) return;

    const { blessPer } = this.state;
    const { params: {id}, dispatch } = this.props;

    dispatch(fetchBlessList(id, earliestId, blessPer));
  }

  render() {
    const { PARTY_HEADER_IMG, DONEE_DEFAULT_AVATAR } = Constants;
    const {
      party: { party },
      virtualPresent: { presents },
      bless: { blesses, listFetching },
      user: { currentUser },
      dispatch,
      params,
    } = this.props;

    const partyId = params.id;
    const {
      id,
      birth_day,
      message,
      person_avatar,
      user_id,
    } = party;

    const avatar = person_avatar && person_avatar.url ? person_avatar.url : DONEE_DEFAULT_AVATAR;

    const dateStr = formatDate(birth_day, 'yyyy年MM月dd日');
    const partyActionCreators = bindActionCreators(PartyActions, dispatch);
    const presentActionCreators = bindActionCreators(PresentActions, dispatch);
    const blessActionCreators = bindActionCreators(BlessActions, dispatch);

    return (
      <div className="page-container party-container">
        <div className="container-nano">
          <div className="container-content" onScroll={this.handleScroll.bind(this)}>
            <div className="container">
              <div className="row">
                <div className="party-header">
                  <img className="party-poster" src={PARTY_HEADER_IMG}/>
                  <AvatarUpload avatar_url={avatar} partyId={partyId} currentUser={currentUser}
                    createUserId={user_id} {...partyActionCreators} />
                  <div className="birthday-bless" onClick={this.openPhaseModal.bind(this)}>
                    <div className="birthday">
                      <div className="sentence text-ellipsis">
                        { dateStr }
                      </div>
                    </div>
                    <div className="bless">
                      <div className="sentence text-ellipsis">
                        { message }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="party-body">
                  <div className="bless-container">
                    <div className="bless-props"></div>
                    <BlessGroup blesses={blesses} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="page-footer party-footer">
            <div className="container">
              <div className="row">
                <div className="give-bless" onClick={this.openPresentModal.bind(this)}>
                  我要送祝福
                </div>
              </div>
            </div>
            { listFetching &&
              <div className="loading-container"><Loading color="#FF280B" size="9px" /></div>
            }
          </div>
        </div>

        { this.state.showPhaseModal && <BlessPhase onClose={this.closePhaseModal.bind(this)}
          partyId={id} message={message} {...partyActionCreators} /> }

        <BlessDistribute onClose={this.closePresentModal.bind(this)}
          partyId={id} presents={presents} {...presentActionCreators}
          {...blessActionCreators} ref="blessDistribute" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    party: state.party,
    bless: state.bless,
    virtualPresent: state.virtualPresent,
    user: state.user,
  };
}

export default connect(mapStateToProps)(PartyPage);
