import React from 'react';
import { Router, Route } from 'react-router';
import { createHashHistory } from 'history';

import Home from './home';
import Search from './search';

const history = createHashHistory();

export default () => (
  <Router history={history}>
    <div>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
    </div>
  </Router>
);
