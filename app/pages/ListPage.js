import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchList, updateItemStatus} from '../actions';

import Item from '../components/Item';

class ListPage extends Component {
  constructor(props) {
    super(props);
    this.handleUpdateItemStatus = this.handleUpdateItemStatus.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchList());
  }

  handleUpdateItemStatus(index, status) {
    const {dispatch} = this.props;
    dispatch(updateItemStatus(index, status));
  }

  render() {
    return (
      <div className="page list-page">
        <img className="list-poster" src="http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/100159/1a147519bd2b1d9bebe7e3e7527869e3.jpg"/>
        <ul className="list">
          {
            this.props.list.items.map((item, index) => {
              return <Item key={item.id} index={index} {...item} updateItemStatus={this.handleUpdateItemStatus}/>;
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
