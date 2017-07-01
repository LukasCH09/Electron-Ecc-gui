import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import style from './Menu.css';
import * as CounterActions from '../actions/counter';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pathName: props.router.location.pathname,
      active: {
        default: '',
        send: '',
        receive: '',
        transactions: '',
        about: ''
      }
    }

    this.checkStateMenu(props.router.location.pathname);
  }

  checkStateMenu(pathName) {
    let aLinks;
    if (pathName == '/'){
      aLinks = this.state.active;
      aLinks['default'] = 'active';
      aLinks['send'] = '';
      aLinks['receive'] = '';
      aLinks['transactions'] = '';
      aLinks['about'] = '';
      this.setState({ active: aLinks });
    }

    if (pathName == '/send'){
      aLinks = this.state.active;
      aLinks['default'] = '';
      aLinks['send'] = 'active';
      aLinks['receive'] = '';
      aLinks['transactions'] = '';
      aLinks['about'] = '';
      this.setState({ active: aLinks });
    }

    if (pathName == '/receive') {
      aLinks = this.state.active;
      aLinks['default'] = '';
      aLinks['send'] = '';
      aLinks['receive'] = 'active';
      aLinks['transactions'] = '';
      aLinks['about'] = '';
      this.setState({ active: aLinks });
    }

    if (pathName == '/transaction') {
      aLinks = this.state.active;
      aLinks['default'] = '';
      aLinks['send'] = '';
      aLinks['receive'] = '';
      aLinks['transactions'] = 'active';
      aLinks['about'] = '';
      this.setState({ active: aLinks });
    }

    if (pathName == '/about') {
      aLinks = this.state.active;
      aLinks['default'] = '';
      aLinks['send'] = '';
      aLinks['receive'] = '';
      aLinks['transactions'] = '';
      aLinks['about'] = 'active';
      this.setState({ active: aLinks });
    }
  }

  componentWillReceiveProps(props){
    // console.log(props.router.location.pathname);
    this.checkStateMenu(props.router.location.pathname);
    this.setState({ pathname: props.router.location.pathname });
  }
  render() {
    return (
        <div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" href="#"></a>
              </div>
              <ul className="nav navbar-nav">

                <li className={this.state.active.default}>

                  <Link to="/" style={{ color: 'white' }}>
                    Overview
                   </Link>

                </li>

                <li className={this.state.active.send}>
                  <Link to="/send" className={style.whiteNav}>
                    Send
                  </Link>
                </li>


                <li className={this.state.active.receive}>

                  <Link to="/receive" className={style.whiteNav}>
                    Recieve

                   </Link>

                </li>

                <li className={this.state.active.transactions}>

                  <Link to="/transaction" className={style.whiteNav}>
                    Transactions
                  </Link>

                </li>

                <li className={this.state.active.about}>

                  <Link to="/about" className={style.whiteNav}>
                    About
                   </Link>

                </li>

              </ul>
            </div>
          </nav>

        </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    router: state.router
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);


// export default Menu;
