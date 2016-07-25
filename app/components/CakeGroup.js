import React, { Component } from 'react';
import { Link } from 'react-router';
import lovePNG from '../images/love.png';
import Constants from '../constants';

export default class CakeGroup extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.cakeItems != this.props.cakeItems;
  }

  render() {
    const { cakeItems } = this.props;
    const { CAKE_LIST_IMG } = Constants;

    return (
      <div className="cake-group">
        <img src={CAKE_LIST_IMG} className="cake-poster" />
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
        </ul>
      </div>
    );
  }
}
