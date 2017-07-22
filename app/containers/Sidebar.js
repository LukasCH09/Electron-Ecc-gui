import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Wallet  from '../utils/wallet';
import {traduction} from '../lang/lang';

const lang = traduction();
const wallet = new Wallet();


export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: props.route.location.pathname,
      active: {
        default: '',
        send: '',
        receive: '',
        transactions: '',
        about: '',
        wallet: ''
      },
      icons: {
        default: '',
        send: '',
        receive: '',
        transactions: '',
        about: '',
        wallet: ''
      },
      currentHeight: 0,
      numpeers: 0,
      networkbestblock: 0
    }
  }

  componentDidMount(){
    var self = this;
    this.checkStateMenu(this.state.pathname);
    this.infoUpdate();
    this.timerInfo = setInterval(function(){
      self.infoUpdate();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timerInfo);
  }

  infoUpdate() {
    const self = this;
    wallet.getblockcount().then((height) =>{
        self.setState({currentHeight : height});
      }).catch((error) => {
        self.setState({currentHeight : 0});
      });
    
    wallet.getpeerinfo().then((peers) =>{
      var bestHeight = 0
      for(var i = 0; i < peers.length; i++){
        if(peers[i]['startingheight'] > bestHeight){
          bestHeight = peers[i]['startingheight'];
        }
      }
      self.setState({networkbestblock : bestHeight, numpeers : peers.length});
    }).catch((error) => {
      self.setState({networkbestblock : 0, numpeers : 0});
    });
  }

  checkStateMenu(pathname) {
    let aLinks = this.state.active;
    let aIcons = this.state.icons;

    aLinks['default'] = '';
    aLinks['send'] = '';
    aLinks['receive'] = '';
    aLinks['transactions'] = '';
    aLinks['security'] = '';
    aLinks['about'] = '';
    aLinks['settings'] = '';

    aIcons['default'] = require("../../resources/images/overview1.ico");
    aIcons['send'] = require('../../resources/images/send1.ico');
    aIcons['receive'] = require('../../resources/images/receive1.ico');
    aIcons['transactions'] = require('../../resources/images/trans1.ico');
    aIcons['security'] = require('../../resources/images/backup1.ico');
    aIcons['about'] = require('../../resources/images/about1.ico');
    aIcons['settings'] = require('../../resources/images/settings1.ico');

    if (pathname == '/'){
      aLinks['default'] = "sidebaritem_active";
      aIcons['default'] = require("../../resources/images/overview2.ico");
    }else if (pathname == '/send'){
      aLinks['send'] = "sidebaritem_active";
      aIcons['send'] = require("../../resources/images/send2.ico");
    }else if (pathname == '/receive') {
      aLinks['receive'] = "sidebaritem_active";
      aIcons['receive'] = require("../../resources/images/receive2.ico");
    }else if (pathname == '/transaction') {
      aLinks['transactions'] = "sidebaritem_active";
      aIcons['transactions'] = require("../../resources/images/trans2.ico");
    }else if (pathname == '/security') {
      aLinks['security'] = "sidebaritem_active";
      aIcons['security'] = require("../../resources/images/backup2.ico");
    }else if (pathname == '/about') {
      aLinks['about'] = "sidebaritem_active";
      aIcons['about'] = require("../../resources/images/about2.ico");
    }else if (pathname == '/settings') {
      aLinks['settings'] = "sidebaritem_active";
      aIcons['settings'] = require("../../resources/images/settings2.ico");
    }

    this.setState({ active: aLinks, icons: aIcons});

  }

  componentWillReceiveProps(props){
    // console.log(props.router.location.pathname);
    this.checkStateMenu(props.route.location.pathname);
    this.setState({ pathname: props.route.location.pathname });
  }

  renderRectRound(opt){
    if(opt == this.state.pathname){
      return (
        <div className="rectround"></div>
      );
    }else{
      return null;
    }
  }

  render() {
    var progressBar = 0;
    if(this.state.currentHeight != 0 && this.state.networkbestblock != 0){
      progressBar = (this.state.currentHeight/this.state.networkbestblock)*100;
    }

    if(progressBar >= 100 && this.state.currentHeight < this.state.networkbestblock){
      progressBar = 99.99;
    }
    var usericon = require("../../resources/images/logo1.png");
    return (
        <div className="sidebar">
          <div className="userimage">
            <img src={usericon}/>
          </div>
          <ul className="sidebarlist">
              <div className={"sidebaritem " + this.state.active.default}>
                <Link to="/" className={this.state.active.default}>
                  <img className="sidebaricon" src={this.state.icons.default}/>
                  {lang.navBarOverviewButton}
                </Link>
                {this.renderRectRound("/")}
              </div>
              <div className={"sidebaritem " + this.state.active.send}>
                <Link to="/send" className={this.state.active.send}>
                  <img className={"sidebaricon"} src={this.state.icons.send}/>
                  {lang.navBarSendButton}
                </Link>
                {this.renderRectRound("/send")}
              </div>
              <div className={"sidebaritem " + this.state.active.receive}>
                <Link to="/receive" className={this.state.active.receive}>
                  <img className="sidebaricon" src={this.state.icons.receive}/>
                  {lang.navBarReceiveButton}
                </Link>
                {this.renderRectRound("/receive")}
              </div>
              <div className={"sidebaritem " + this.state.active.transactions}>
                <Link to="/transaction" className={this.state.active.transactions}>
                  <img className="sidebaricon" src={this.state.icons.transactions}/>
                  {lang.navBarTransactionsButton}
                </Link>
                {this.renderRectRound("/transaction")}
              </div>
              <div className={"sidebaritem " + this.state.active.security}>
                <Link to="/security" className={this.state.active.security}>
                  <img className="sidebaricon" src={this.state.icons.security}/>
                  {lang.navBarSecurityButton}
                </Link>
                {this.renderRectRound("/security")}
              </div>
              <div className={"sidebaritem " + this.state.active.about}>
                <Link to="/about" className={this.state.active.about}>
                  <img className="sidebaricon" src={this.state.icons.about}/>
                  {lang.navBarAboutButton}
                </Link>
                {this.renderRectRound("/about")}
              </div>
              <div className={"sidebaritem " + this.state.active.settings}>
                <Link to="/settings" className={this.state.active.settings}>
                  <img className="sidebaricon" src={this.state.icons.settings}/>
                  {lang.navBarSettingsButton}
                </Link>
                {this.renderRectRound("/settings")}
              </div>
            </ul>
            <div className="connections">
              <p>{lang.nabBarNetworkInfoSyncing + " " + progressBar.toFixed(2) + "%"}</p>
              <p>{"( " + lang.nabBarNetworkInfoBlock + " " + this.state.currentHeight + " " + lang.conjuctionOf + " " + this.state.networkbestblock + ")"}</p>
              <div className="progress custom_progress">
                <div className="progress-bar progress-bar-success progress-bar-striped" role="progressbar"
                aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width:progressBar.toFixed(2)+"%",backgroundColor:"#8DA557"}}>
                </div>
              </div>
              <p>{lang.nabBarNetworkInfoActiveConnections + ": " + this.state.numpeers}</p>
            </div>
        </div>
    );
  }
}
