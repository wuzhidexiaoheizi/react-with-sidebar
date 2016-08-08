import React, { Component } from 'react';
import DRCode from '../components/DRCode';
import { fetchCakeList } from '../actions/cakeList';
import { fetchRecentlyParties } from '../actions/party';
import { connect } from 'react-redux';
import Loading from 'halogen/ScaleLoader';
import Constants from '../constants';
import CakeGroup from '../components/CakeGroup';
import { Link } from 'react-router';
import RecentPartyList from '../components/RecentPartyList';
import { updateDocumentTitle } from '../helper';
import Guide from '../components/Guide';

class ListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDRText: false,
      cakePer: 10,
      cakePage: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { cakePage, cakePer } = this.state;

    updateDocumentTitle('生日蛋糕');

    dispatch(fetchCakeList(cakePage, cakePer));
    dispatch(fetchRecentlyParties());
  }

  onScroll(e) {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;

    if (scrollTop + offsetHeight == scrollHeight) {
      this.setState({showDRText: true});
      this.loadNextPage();
    } else {
      this.setState({showDRText: false});
    }
  }

  loadNextPage() {
    const { cakeList: { listFetching, loadedPage }, dispatch } = this.props;
    const { cakePer } = this.state;

    if (listFetching) return;

    dispatch(fetchCakeList(loadedPage + 1, cakePer));
  }

  showGuide() {
    const { guide } = this.refs;
    guide.showNoviceGuide();
  }

  showOverlayer() {
    const { overlayer } = this.refs;
    overlayer.style.display = 'block';
  }

  hideOverlayer() {
    const { overlayer } = this.refs;
    overlayer.style.display = 'none';
  }

  render() {
    const {
      cakeList: { listFetching, cakeItems },
      party: { recentlyParties },
    } = this.props;
    const { DOMAIN, MINE_LAUCHED_PARTY_URL, MINE_ATTEND_PARTY_URL } = Constants;
    const launchUrl = `${DOMAIN}${MINE_LAUCHED_PARTY_URL}`;
    const attendUrl = `${DOMAIN}${MINE_ATTEND_PARTY_URL}`;

    return (
      <div className="page-container list-container">
        <div className="container">
          <div className="row">
            {Constants.QRCODE && <DRCode showText={this.state.showDRText}/>}
            {listFetching && <div className="loading-container"><Loading color="#FF280B" size="9px" margin="4px"/></div>}
          </div>
        </div>

        <div className="list-page-container" onScroll={this.onScroll.bind(this)}>
          <div className="list-page">
            <div className="container">
              <div className="row">
                <div className="party-entrance">
                  <div className="entrance-wrap">
                    <a href={launchUrl} className="own-launch">生日趴</a>
                    <a href={attendUrl} className="own-attend">参与过</a>
                    <Link to="/rank" className="happiness-rank">幸福榜</Link>
                  </div>
                </div>
                <div className="list-header">
                  <img className="list-poster" src={Constants.HEADER_IMG} />
                  <div className="guide-entrance" onClick={this.showGuide.bind(this)}></div>
                </div>
                <div className="party-body">
                  <RecentPartyList parties={recentlyParties} />
                  <CakeGroup cakeItems={cakeItems} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Guide ref="guide"
          showOverlayer={this.showOverlayer.bind(this)}
          hideOverlayer={this.hideOverlayer.bind(this)}
        />
        <div className="modal-overlayer" ref="overlayer"></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cakeList: state.cakeList,
    party: state.party,
  };
}

export default connect(mapStateToProps)(ListPage);
