import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

class ListPage extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <h1>asdadasd</h1>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    list: state.home
  }
}

export default connect(mapStateToProps)(ListPage)