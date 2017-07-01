/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/Pages/HomePage';
import AboutPage from './containers/Pages/AboutPage';
import ReceivePage from './containers/Pages/ReceivePage';
import TransactionPage from './containers/Pages/TransactionPage';
import SendPage from './containers/Pages/SendPage';

export default () => (
  <App>
    <Switch>
      <Route path="/transaction" component={TransactionPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/receive" component={ReceivePage} />
      <Route path="/send" component={SendPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
