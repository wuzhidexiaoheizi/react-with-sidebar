import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Loading from 'halogen/ScaleLoader';
import DRCode from '../components/DRCode';

import * as Actions from '../actions';
import ItemsGroup from '../components/ItemsGroup';

class ListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDRText: false
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(Actions.fetchList());
  }

  onScroll(e) {
    const {scrollTop, scrollHeight, offsetHeight} = e.target;
    if (scrollTop + offsetHeight == scrollHeight) {
      this.setState({showDRText: true});
    } else {
      this.setState({showDRText: false});
    }
  }

  slideDown() {
    const link = this.refs['share-link'];
    const page = this.refs['list-page'];
    const { offsetHeight } = link;

    page.style.top = offsetHeight + 'px';
  }

  slideUp() {
    const page = this.refs['list-page'];
    page.style.top = '0';
  }

  sortByPrice(priceArr) {
    const {list: {items}, dispatch} = this.props;
    const boundActionCreators = bindActionCreators(Actions, dispatch);
    return priceArr.map(price =>
      <ItemsGroup
        key={price}
        price={price}
        items={items.filter(item => item.price == price)}
        boundActionCreators={boundActionCreators}
      />);
  }

  otherPrice(priceArr) {
    const {list: {items}, dispatch} = this.props;
    const boundActionCreators = bindActionCreators(Actions, dispatch);
    return (
      <ItemsGroup
        key="other"
        price="other"
        items={items.filter(item => !priceArr.includes(+item.price))}
        boundActionCreators={boundActionCreators}
      />
    );
  }

  render() {
    const {list: {listFetched}} = this.props;

    return (
      <div className="page-container">
        {__QR_CODE__ && <DRCode showText={this.state.showDRText}/>}
        <a className="share-link" ref="share-link" href={__INTRODUCTION_LINK__}>
          <img className="share-pic" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop_category/image/0c549461633e696a8841886a888b6a93.jpg"
            onLoad={this.slideDown.bind(this)}/>
        </a>
        <span className="close-btn" onClick={this.slideUp.bind(this)}>
          <img src="http://wanliu-piano.b0.upaiyun.com/uploads/shop_category/image/c2216f3de316b5622d077cd145afe6f8.png" />
        </span>
        <div className="page list-page" onScroll={this.onScroll.bind(this)} ref="list-page">
          <img className="list-poster" src={__LIST_IMG__}/>
          {!listFetched && <div style={{textAlign: 'center'}}><Loading color="#FFF" size="9px" margin="4px"/></div>}
          <ul className="list">
            {this.sortByPrice([1, 3, 5, 10])}
            {this.otherPrice([1, 3, 5, 10])}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.list
  };
}

export default connect(mapStateToProps)(ListPage);
