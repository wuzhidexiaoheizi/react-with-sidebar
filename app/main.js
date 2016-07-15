import React, {Component, cloneElement} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, Link, IndexLink} from 'react-router';
import TransitionGroup from 'react-addons-css-transition-group';
import configureStore from './store/configureStore';
import 'babel-polyfill';
import createBrowserHistory from 'history/lib/createHashHistory';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import PartyPage from './pages/PartyPage';
import ReviewPage from './pages/ReviewPage';
import GuidePage from './pages/GuidePage';
// import Alert from './components/Alert';
import './style/main.styl';
import 'react-fastclick';

const store = configureStore();
const history = createBrowserHistory({ queryKey: false });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transitionName: 'right',
    };
  }

  componentWillReceiveProps(nextProps) {
    const paths = ['/list', '/detail', '/party', '/review', '/guide'];

    const currentPathname = this.slicePathname(this.props.location.pathname);
    const nextPathname = this.slicePathname(nextProps.location.pathname);
    const currentPathIndex = paths.indexOf(currentPathname);
    const nextPathIndex = paths.indexOf(nextPathname);
    const transitionName = currentPathIndex > nextPathIndex ? 'right' : 'left';

    this.setState({transitionName});
  }

  slicePathname(pathname) {
    let index = pathname.indexOf('/detail');

    if (index > -1) return '/detail';

    index = pathname.indexOf('/party');

    if (index > -1) return '/party';

    index = pathname.indexOf('/review');

    if (index > -1) return '/review';

    return pathname;
  }

  devNav() {
    if (__ENV__ == 'DEV') {
      return (
        <ul className="development-nav">
          <li><IndexLink to="/list" activeClassName="active">list</IndexLink></li>
          <li><Link to="/detail/1" activeClassName="active">detail</Link></li>
          <li><Link to="/party/1" activeClassName="active">party</Link></li>
          <li><Link to="/review/1" activeClassName="active">review</Link></li>
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

// function changeRouteHandle() {

// }

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={ListPage}/>
        <Route path="/list" component={ListPage}/>
        <Route path="/detail/:id" component={DetailPage}/>
        <Route path="/review/:id" component={ReviewPage}/>
        <Route path="/party/:id" component={PartyPage}/>
        <Route path="/guide" component={GuidePage}/>
        <Route path="*" component={ListPage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
