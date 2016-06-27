import React, { Component } from 'react';
import DRCode from '../components/DRCode';
import { Link } from 'react-router';
import { fetchCakeList } from '../actions/cakeList';
import { connect } from 'react-redux';
import Loading from 'halogen/ScaleLoader';
import Constants from '../constants';
import lovePNG from '../images/love.png';

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
    dispatch(fetchCakeList(cakePage, cakePer));
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

  render() {
    const { cakeList: { listFetching, cakeItems } } = this.props;

    return (
      <div className="page-container list-container">
        <div className="container">
          <div className="row">
            {__QR_CODE__ && <DRCode showText={this.state.showDRText}/>}
          </div>
        </div>

        <div className="list-page-container" onScroll={this.onScroll.bind(this)}>
          <div className="list-page" ref="list-page">
            <div className="container">
              <div className="row">
                <img className="list-poster" src={Constants.HEADER_IMG} />
                <ul className="cake-list">
                  {cakeItems.map(cakeItem =>
                    <li className="cake-item" key={cakeItem.id}>
                      <Link to={`/detail/${cakeItem.id}`} className="link">
                        <div className="row">
                          <div className="col-xs-5">
                            <img className="item-pic" src={cakeItem.cover_url} />
                          </div>
                          <div className="col-xs-7">
                            <div className="item-title">
                              {cakeItem.title}
                            </div>
                            <div className="item-price">
                              <span className="price">&#165;{cakeItem.income_price}元</span>
                              <span className="ori_price">原价:<s>&#165;{cakeItem.public_price}元</s></span>
                            </div>
                            <div className="donee-count">
                              获得30个返现<img src={lovePNG} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  )}

                  {listFetching && <div style={{textAlign: 'center'}}><Loading color="#FFF" size="9px" margin="4px"/></div>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cakeList: state.cakeList
  };
}

export default connect(mapStateToProps)(ListPage);
