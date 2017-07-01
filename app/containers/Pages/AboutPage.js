import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import About from '../../components/AboutPage/About';
import * as CounterActions from '../../actions/counter';

function mapStateToProps(state) {
  return {
    counter: state.copy
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(About);
