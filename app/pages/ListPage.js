import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';

import Item from '../components/Item';

class ListPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(Actions.fetchList());
  }

  render() {
    const {dispatch} = this.props;
    const boundActionCreators = bindActionCreators(Actions, dispatch);
    return (
      <div className="page list-page">
        <img className="list-poster" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/1a147519bd2b1d9bebe7e3e7527869e3.jpg"/>
        <ul className="list">
          {
            this.props.list.items.map(item => {
              return <Item key={item.id} {...item} {...boundActionCreators}/>;
            })
          }
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
