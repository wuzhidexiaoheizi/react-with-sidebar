import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, Link, IndexLink} from 'react-router';
import TransitionGroup from 'react-addons-css-transition-group';
import configureStore from './store/configureStore';
import 'babel-polyfill';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
// import DevTools from './pages/DevTools';

import HomePage from './pages/HomePage';
import Alert from './components/Alert';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import SharePage from './pages/SharePage';
import CommentPage from './pages/CommentPage';
import './style/main.styl';
import FastClick from 'fastclick';

FastClick.attach(document.body);

// const history = createBrowserHistory();
const store = configureStore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transitionName: 'right',
    };
  }

  componentWillReceiveProps(nextProps) {
    const currntPathname = this.props.location.pathname;
    const nextPathname = nextProps.location.pathname;
    let transitionName = 'right';

    if (currntPathname == '/' || nextPathname.includes('/detail')) transitionName = 'left';
    this.setState({transitionName});
  }

  devNav() {
    if (__ENV__ == 'DEV') {
      return (
        <ul className="nav">
          {/* <DevTools /> */}
          <li><IndexLink to="/" activeClassName="active">/</IndexLink></li>
          <li><Link to="/list" activeClassName="active">list</Link></li>
          <li><Link to="/detail/82" activeClassName="active">detail</Link></li>
          <li><Link to="/comment" activeClassName="active">comment</Link></li>
          <li><Link to="/share" activeClassName="active">share</Link></li>
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
        <TransitionGroup transitionName={this.state.transitionName} component="div" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
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
        <Route path="/comment" component={CommentPage} />
        <Route path="/share" component={SharePage} />
      </Route>
    </Router>
  </Provider>,
  document.body.appendChild(document.createElement('div'))
);
