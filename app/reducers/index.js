// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
// import updater from './updater';

const rootReducer = combineReducers({
  counter,
  router,
  // updater
});

export default rootReducer;
