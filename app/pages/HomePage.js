import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {signIn} from '../actions'


class HomePage extends Component {
  constructor(props) {
    super(props)
  }
  
  _handleSignIn() {
    const {dispatch} = this.props
    // dispatch(signIn())
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
    )
  }
}

function mapStateToProps(state) {
  return {
    home: state.home
  }
}

export default connect(mapStateToProps)(HomePage)