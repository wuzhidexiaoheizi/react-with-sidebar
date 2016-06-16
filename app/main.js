import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, Link, IndexLink} from 'react-router';
import TransitionGroup from 'react-addons-css-transition-group';
// import configureStore from './store/configureStore';
import 'babel-polyfill';

import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import PartyPage from './pages/PartyPage';
import ReviewPage from './pages/ReviewPage';
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
    const currntPathname = this.props.location.pathname;
    const nextPathname = nextProps.location.pathname;
    let transitionName = 'right';

    console.log('context', this.this);
    if (currntPathname == '/' || nextPathname.includes('/detail')) transitionName = 'left';
    this.setState({transitionName});
  }

  devNav() {
    if (__ENV__ == 'DEV') {
      return (
        <ul className="development-nav">
          <li><IndexLink to="/list" activeClassName="active">/</IndexLink></li>
          <li><Link to="/detail" activeClassName="active">detail</Link></li>
          <li><Link to="/review" activeClassName="active">review</Link></li>
          <li><Link to="/party" activeClassName="active">party</Link></li>
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
        <Route path="*" component={ListPage} />
      </Route>
    </Router>,
  document.getElementById('app')
);
