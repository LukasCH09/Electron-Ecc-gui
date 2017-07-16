import React, { Component } from 'react';
import TransactionTable from './Transactions/TransactionTable';
import Wallet  from '../utils/wallet';
import {exchanges, Interval} from '../utils/exchange';
import {traduction} from '../lang/lang';

var log = require('../utils/log');
var event = require('../utils/eventhandler');

const lang = traduction();
const wallet = new Wallet();


export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentECC: 0,
      pendingECC: 0,
      unconfirmedECC: 0,
      stakeECC: 0,
      stakeEarnedEcc: 0,
      currentExchangePrice: {'coinexchange': 0},
      select: "all",
      locked: true,
      dialog: false,
      timeL: "",
      passPhrase: "",
      passPhraseError: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.changeWalletState = this.changeWalletState.bind(this);
    this.cancelDialog = this.cancelDialog.bind(this);
    this.confirmDialog = this.confirmDialog.bind(this);
    this.onPassPhraseChange = this.onPassPhraseChange.bind(this);
    this.onTimeLChange = this.onTimeLChange.bind(this);
  }

  componentDidMount(){
    this.exchangeInterval();
    this.getWalletInfo();    
    this.setTimerFunctions();
  }

  componentWillUnmount() {
    clearInterval(this.exInterval);
    clearInterval(this.timerInfo);
    this.state.requesting1=false;
    this.state.requesting2=false;
  }

  setTimerFunctions(){
    var self = this;
    
    self.timerInfo = setInterval(function(){
      if(!self.state.requesting1){
        self.getWalletInfo();
      }
    }, 5000);
  }

  getWalletInfo(){
    const self = this;

    this.setState({requesting1:true});

    wallet.getInfo().then((data) =>{
      if(self.state.requesting1){
        var locked = true;
        if(data.unlocked_until != 0){
          locked = false;
        }
        self.setState({locked: locked, currentECC: data.balance, stakeECC: data.stake, requesting1:false});
      }
      event.emit("hide");
    }).catch((err) => {
      log.error(err.message);
      if(self.state.requesting1 && err.message != "Method not found"){
        event.emit("show",lang.notificationDaemonDownOrSyncing);
        self.setState({locked: true, currentECC: 0, unconfirmedECC: 0, stakeECC: 0, stakeEarnedEcc: 0, requesting1:false});
      }
    });
  }

  
  exchangeInterval() {
    const self = this;

    exchanges().getLastPrices().then((data) => {
      let currentExchangePrice = self.state.currentExchangePrice;
      currentExchangePrice['coinexchange'] = data['CoinExchange.io'];
      self.setState({currentExchangePrice: currentExchangePrice});
      event.emit("hide");
    }).catch((err) => {
      log.error(err.message);
      event.emit("show",lang.notificationExchangeInfo);
    });

    self.exInterval = setInterval(() => {
      exchanges().getLastPrices().then((data) => {
        let currentExchangePrice = self.state.currentExchangePrice;
        currentExchangePrice['coinexchange'] = data['CoinExchange.io'];
        if(self.refs.coinexio){
          self.setState({currentExchangePrice: currentExchangePrice});
          event.emit("hide");
        }
      }).catch((err) => {
        log.error(err.message);
        event.emit("show",lang.notificationExchangeInfo);
      });
    }, 5000);
  }

  handleChange(event){
    this.setState({select: event.target.value});
  }

  onPassPhraseChange(event){
      this.setState({passPhrase: event.target.value});
  }

  onTimeLChange(event){
      this.setState({timeL: event.target.value});
  }

  changeWalletState(){
    this.setState({dialog:true});
  }

  renderDialogBody(){
    if(this.state.locked){
      return(
        <div>
          <div className="header">
            <p className="title">{lang.overviewModalAuthTitle}</p>
          </div>
          <div className="body">
            <p className="desc">{lang.ovweviewModalAuthDesc}</p>
            <div className="row">
              <div className="col-md-10 col-md-offset-1 input-group">
                <input className="form-control inpuText" type="password" value={this.state.passPhrase} onChange={this.onPassPhraseChange} placeholder={lang.walletPassPhrase}/>
              </div>
              <div className="col-md-10 col-md-offset-1 input-group" style={{marginTop:"15px"}}>
                <input className="form-control inpuText" type="number" value={this.state.timeL} onChange={this.onTimeLChange} placeholder={lang.secondsUnlocked}/>
              </div>
              <p className="passPhraseError">{this.state.passPhraseError}</p>
            </div>
          </div>
        </div>
      );
    }else{
      return(
        <div>
          <div className="header">
            <p className="title">{lang.popupMessageConfirmationRequired}</p>
          </div>
          <div className="body">
            <p className="desc">{lang.ovweviewModalLockQuestion}</p>
          </div>
        </div>
      );
    }
  }

  renderDialog(){
    if(!this.state.dialog){
      return null;
    }else{
      return (
        <div className="mancha">
          <div className="dialog">
            {this.renderDialogBody()}
            <div className="footer">
              <p className="button btn_cancel" onClick={this.cancelDialog}>{lang.cancel}</p>
              <p className="button btn_confirm" onClick={this.confirmDialog}>{lang.confirm}</p>
            </div>
          </div>
        </div>
      );
    }
  }

  cancelDialog(){
    this.setState({dialog: false, passPhraseError: "", passPhrase: "", timeL: ""});
  }

  confirmDialog(){
    var self = this;
    if(this.state.locked){
      var passPhrase = this.state.passPhrase;
      var timeL = this.state.timeL;

      if(passPhrase.length == 0 || timeL.length == 0){
        self.setState({passPhraseError: lang.invalidFields});
      }else{
        wallet.walletpassphrase(passPhrase,timeL).then((data) =>{
          if(data != null &&  data.code == -14){
            self.setState({passPhraseError: lang.walletWrongPass});
          }else if(data != null && data.code == "ECONNREFUSED"){
            event.emit("show",lang.notificationDaemonDownOrSyncing);
            self.setState({dialog: false, passPhraseError: "", passPhrase: "", timeL: ""});
          }else if (data == null){
            event.emit("animate",lang.walletUnlockedFor + " " + timeL + " " + lang.sedonds);
            self.setState({dialog: false, passPhraseError: "", passPhrase: "", timeL: ""});
          }else{
            event.emit("show",lang.notificationDaemonDownOrSyncing);
            self.setState({dialog: false, passPhraseError: "", passPhrase: "", timeL: ""});
          }
        }).catch((err) => {
          log.error(err.message);
          self.setState({passPhraseError: lang.walletUnlockError});
        });
      }
    }else{
      wallet.walletlock().then((data) =>{
        if(data == null){
          event.emit("animate",lang.walletLocked);
        }else{
          event.emit("animate",lang.walletLockedError);
        }
      }).catch((err) => {
        log.error(err.message);
        event.emit("animate",lang.walletLockedError);
      });
      self.setState({dialog: false, passPhraseError: "", passPhrase: "", timeL: ""});
    }
  }

  render() {
    var pad = require("../media/icons/padclose.png")
    if(!this.state.locked){
      pad = require("../media/icons/padopen.png");
    }
    return (
      <div className="home">
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-default">
              <div className="panel-body">
                <div>
                   <p className="title">{lang.overviewMyWallet}</p>
                   <img className="padicon" src={pad} onClick={this.changeWalletState.bind(this)}/>
                </div>
                <div className="col-lg-4 col-xs-6 col-md-4">
                  <p className="subtitle">{lang.overviewMyBalance}:</p>
                  <p className="borderBot"><span className="desc">{this.state.currentECC}</span> <span className="desc2">ecc</span></p>
                </div>
                <div className="col-lg-4 col-xs-6 col-md-4">
                  <p className="subtitle">{lang.overviewMyStaking}:</p>
                  <p className="borderBot"><span className="desc">{this.state.stakeECC}</span> <span className="desc2">ecc</span></p>
                </div>
                <div className="col-lg-4 col-xs-6 col-md-4">
                  <p className="subtitle">CoinExchange.io:</p>
                  <p className="borderBot"><span className="desc">{this.state.currentExchangePrice.coinexchange}</span> <span className="desc2">btc</span></p>
                </div>
                <div className="col-lg-4 col-xs-6 col-md-4">
                  <p className="subtitle">{lang.overviewTotal}:</p>
                  <p className="borderBot"><span className="desc">{this.state.stakeECC + this.state.currentECC}</span> <span className="desc2">ecc</span></p>
                </div>
                <div className="col-lg-4 col-xs-6 col-md-4">
                  <p className="subtitle">{lang.overviewMyUnconfirmed}:</p>
                  <p className="borderBot"><span className="desc">{this.state.unconfirmedECC}</span> <span className="desc2">ecc</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 ">
            <div className="panel panel-default transaction-container">
              <div className="panel-body">
                <p className="title">{lang.overviewMyLatest100Transactions}</p>
                <div className="selectfield">
                  <select className="form-control" value={this.state.select} onChange={this.handleChange}>
                    <option value="all">{lang.all}</option>
                    <option value="send">{lang.send}</option>
                    <option value="receive">{lang.received}</option>
                    <option value="generate">{lang.staked}</option>
                    <option value={0}>{lang.pending}</option>
                    <option value={1}>{lang.confirmed}</option>
                    <option value={-1}>{lang.orphaned}</option>
                  </select>
                </div>
                <TransactionTable h={"250px"} option={this.state.select} countTras={100}/>
              </div>
            </div>
          </div>
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}
