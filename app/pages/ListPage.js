import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Loading from 'halogen/ScaleLoader';

import * as Actions from '../actions';
import ItemsGroup from '../components/ItemsGroup';

class ListPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(Actions.fetchList());
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
      <div className="page list-page">
        <img className="list-poster" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/91cae30408888ba804253fdf62644fa1.jpg"/>
        {!listFetched && <div style={{textAlign: 'center'}}><Loading color="#FFF" size="9px" margin="4px"/></div>}
        <ul className="list">
          {this.sortByPrice([1, 5, 10])}
          {this.otherPrice([1, 5, 10])}
        </ul>
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
