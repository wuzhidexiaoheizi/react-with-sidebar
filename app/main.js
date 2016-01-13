import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createHistory } from 'history'
import { Router, Route, IndexRoute, Link, IndexLink, hashHistory } from 'react-router'
import TransitionGroup from 'react-addons-css-transition-group'


import configureStore from './store/configureStore'

import DevTools from './pages/DevTools'
import HomePage from './pages/HomePage'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'

import './style/main.styl'

const store = configureStore()

class App extends React.Component {
  render() {
    const {pathname} = this.props.location
    return (
      <div>
        <ul className="nav">
          <li><IndexLink to="/" activeClassName="active">/</IndexLink></li>
          <li><Link to="/list" activeClassName="active">list</Link></li>
          <li><Link to="/detail" activeClassName="active">detail</Link></li>
        </ul>
        <DevTools />
        <TransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {React.cloneElement(this.props.children || <div/>, { key: pathname })}
        </TransitionGroup>
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={HomePage}/>
        <Route path="/list" component={ListPage}/>
        <Route path="/detail" component={DetailPage}/>
      </Route>
    </Router>
  </Provider>,
  document.body.appendChild(document.createElement('div'))
)