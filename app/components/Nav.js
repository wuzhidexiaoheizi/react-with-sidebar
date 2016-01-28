import React, {Component} from 'react';
import {Link} from 'react-router';

export default class extends Component {
  render() {
    return (
      <nav className="top-nav">
        <Link to="/list">{'＜活动列表'}</Link>
      </nav>
    );
  }
}
