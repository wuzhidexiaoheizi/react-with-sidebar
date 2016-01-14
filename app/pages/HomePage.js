import React, {Component} from 'react';
import {connect} from 'react-redux';


class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  _handleSignIn() {
  }

  render() {
    return (
      <div className="page home">
        <img className="poster" src="../images/poster.jpg"/>
        <div className="introduction">
          <img className="introduction-top" src="../images/introduction-top.png"/>
          <main className="introduction-text">
            text
          </main>
          <img
            className="introduction-bottom"
            src="../images/introduction-bottom.png"
            onClick={this._handleSignIn.bind(this)}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    home: state.home
  };
}

export default connect(mapStateToProps)(HomePage);
