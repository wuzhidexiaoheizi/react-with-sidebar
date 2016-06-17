import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';
// import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, Link, IndexLink} from 'react-router';
import TransitionGroup from 'react-addons-css-transition-group';
// import configureStore from './store/configureStore';
import 'babel-polyfill';

import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import PartyPage from './pages/PartyPage';
import ReviewPage from './pages/ReviewPage';
import GuidePage from './pages/GuidePage';
import './style/main.styl';

// FastClick
import FastClick from 'fastclick';
FastClick.attach(document.body);

// const store = configureStore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transitionName: 'right',
    };
  }

  componentWillReceiveProps(nextProps) {
    const paths = ['/list', '/detail', '/party', '/review', '/guide'];

    const currentPathname = this.props.location.pathname;
    const nextPathname = nextProps.location.pathname;
    const currentPathIndex = paths.indexOf(currentPathname);
    const nextPathIndex = paths.indexOf(nextPathname);

    const transitionName = currentPathIndex > nextPathIndex ? 'right' : 'left';

    this.setState({transitionName});
  }

  devNav() {
    if (__ENV__ == 'DEV') {
      return (
        <ul className="development-nav">
          <li><IndexLink to="/list" activeClassName="active">/</IndexLink></li>
          <li><Link to="/detail" activeClassName="active">detail</Link></li>
          <li><Link to="/party" activeClassName="active">party</Link></li>
          <li><Link to="/review" activeClassName="active">review</Link></li>
          <li><Link to="/guide" activeClassName="active">guide</Link></li>
        </ul>
      );
    }
  }

  render() {
    const {pathname} = this.props.location;

    return (
      <div>
        {this.devNav()}
        <TransitionGroup transitionName={this.state.transitionName} component="div" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {cloneElement(this.props.children || <div/>, { key: pathname })}
        </TransitionGroup>
      </div>
    );
  }
}

function changeRouteHandle() {
  
}

ReactDOM.render(
    <Router onUpdate={changeRouteHandle} >
      <Route path="/" component={App}>
        <IndexRoute component={ListPage}/>
        <Route path="/list" component={ListPage}/>
        <Route path="/detail" component={DetailPage}/>
        <Route path="/review" component={ReviewPage}/>
        <Route path="/party" component={PartyPage}/>
        <Route path="/guide" component={GuidePage}/>
        <Route path="*" component={ListPage} />
      </Route>
    </Router>,
  document.getElementById('app')
);
