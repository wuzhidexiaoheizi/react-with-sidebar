import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Link, IndexLink} from 'react-router';
import TransitionGroup from 'react-addons-css-transition-group';
import configureStore from './store/configureStore';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// import DevTools from './pages/DevTools';
import HomePage from './pages/HomePage';
import Alert from './components/Alert';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import './style/main.styl';
import {DEV} from './config.json';

// const history = createBrowserHistory();
const store = configureStore();

class App extends Component {
  constructor(props) {
    super(props);
  }

  devNav() {
    if (DEV) {
      return (
        <ul className="nav">
          {/* <DevTools /> */}
          <li><IndexLink to="/" activeClassName="active">/</IndexLink></li>
          <li><Link to="/list" activeClassName="active">list</Link></li>
          <li><Link to="/detail/82" activeClassName="active">detail</Link></li>
        </ul>
      );
    }
  }

  render() {
    const {pathname} = this.props.location;
    return (
      <div>
        {this.devNav()}
        <Alert/>
        <TransitionGroup transitionName="fade" component="div" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {cloneElement(this.props.children || <div/>, { key: pathname })}
        </TransitionGroup>
      </div>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path="/" component={App}>
        <IndexRoute component={HomePage}/>
        <Route path="/list" component={ListPage}/>
        <Route path="detail/:id" component={DetailPage}/>
      </Route>
    </Router>
  </Provider>,
  document.body.appendChild(document.createElement('div'))
);
