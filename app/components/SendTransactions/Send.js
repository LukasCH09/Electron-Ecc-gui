import $ from 'jquery';
import React, { Component } from 'react';
import AddressBook from './AddressBook';
import Wallet  from '../../utils/wallet';
import {traduction} from '../../lang/lang';
import ReactLoading from 'react-loading';

var event = require('../../utils/eventhandler');
var log = require('../../utils/log');

const lang = traduction();
const wallet = new Wallet();

class Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eccAddress: '',
      amount: '',
      dialog: false,
      passPhrase: "",
      passPhraseError: "",
    };

    this._handleGenericFormChange = this._handleGenericFormChange.bind(this);
    this._handleSendToAddress = this._handleSendToAddress.bind(this);
    this.friendClicked = this.friendClicked.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.cancelSend = this.cancelSend.bind(this);
    this.confirmSend = this.confirmSend.bind(this);
    this.onPassPhraseChange = this.onPassPhraseChange.bind(this);
  }

  _handleGenericFormChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  onPassPhraseChange(event) {
    this.setState({
      passPhrase: event.target.value
    });
  }

  _handleSendToAddress() {
    var self = this;
    if (this.state.eccAddress !== '') {
      wallet.validate(this.state.eccAddress).then((isAddressValid) => {
        if (!isAddressValid.isvalid) {
          event.emit("animate", lang.addressInvalidError);
        } else {
          if (this.state.amount > 0) {
            $('.loading').hide();
            $('.btn_confirm').removeClass("disable");
            self.setState({dialog: true,passPhraseError: "", passPhrase: ""});
          } else {
            event.emit("animate", lang.amountLessOrEqualTo0);
          }
        }
      }).catch((err) => {
        log.error(err.message);
        event.emit("animate", lang.addressValidadeError);
      });
    } else {
      event.emit("animate", lang.invalidFields);
    }
  }

  friendClicked(friend) {
    this.setState({
      eccAddress: friend.address
    });
  }

  handleClear() {
    this.setState({eccAddress: '',amount: ''});
  }

  cancelSend() {
    this.setState({dialog: false,passPhraseError: "",passPhrase: "",eccAddress: "",amount: ""});
    $('.loading').hide();
    $('.btn_confirm').removeClass("disable");
  }

  confirmSend() {
    var self = this;
    var passPhrase = this.state.passPhrase;
    if (passPhrase.length == 0) {
      self.setState({
        passPhraseError: lang.invalidFields
      });
    } else {
      self.winfo();
    }
  }

  winfo() {
    var self = this;
    wallet.getInfo().then((data) => {
      var utl = 0;
      if (data.unlocked_until != null && data.unlocked_until != 0) {
        utl = data.unlocked_until;
        var t2 = new Date(utl);
        if (t2.getFullYear() < 2000) {
          t2 = new Date(utl * 1000);
        }
        var t1 = new Date();
        var dif = t2.getTime() - t1.getTime();
        var secondsFromtT1toT2 = dif / 1000;
        var diffSeconds = Math.abs(secondsFromtT1toT2);
        utl = parseInt(diffSeconds);
        if (!utl) {utl = 0;}
      }
      self.setState({utl: utl});
      self.wlock();
    }).catch((err) => {
      log.error(err.message);
      self.setState({dialog: false, eccAddress: "", amount: ""});
      event.emit("animate", lang.moneySendError);
    });
  }

  wlock() {
    var self = this;

    $('.loading').show();
    $('.btn_confirm').addClass("disable");

    wallet.walletlock().then((data) => {
      if (data == null) {
        self.wunlock(true, 5);
      } else {
        log.debug(data);
        self.setState({dialog: false, eccAddress: "",amount: ""});
        event.emit("animate", lang.moneySendError);
      }
    }).catch((err) => {
      log.error(err.message);
      self.setState({dialog: false, eccAddress: "",amount: ""});
      event.emit("animate", lang.moneySendError);
    });
  }

  wunlock(keepGoing, newSeconds){
    var self = this;
    var passPhrase = this.state.passPhrase;

    wallet.walletpassphrase(passPhrase, newSeconds).then((data) => {
      if (data != null && data.code == -14) { //wrond password
        $('.loading').hide();
        $('.btn_confirm').removeClass("disable");
        self.setState({passPhraseError: lang.walletWrongPass});
      } else if (data != null && data.code == "ECONNREFUSED") { //connection refused
        event.emit("animate", lang.notificationDaemonDownOrSyncing);
        self.setState({dialog: false, eccAddress: "",amount: ""});
      } else if (data != null && data.code == -17) { // already unloked .. wait that auto locks.. and tries to unlock again
        self.wunlock(false, newSeconds);
      } else if (data == null && keepGoing) { // success unlock continue to send
        self.wsend();
      } else if (data == null && !keepGoing) { // success unlock terminate
        self.setState({dialog: false,eccAddress: "",amount: ""});
        event.emit("animate", lang.moneySent);
      } else if (!keepGoing) { // error
        log.debug(data);
        event.emit("animate", lang.moneySendError);
        self.setState({dialog: false,eccAddress: "",amount: ""});
      }
    }).catch((err) => {
      log.error(err.message);
      if (!keepGoing){
        self.setState({dialog: false,eccAddress: "",amount: ""});
        event.emit("animate", lang.moneySendError);
      }
    });
  }

  wsend() {
    var self = this;

    wallet.sendMoney(self.state.eccAddress, self.state.amount).then((res, reject) => {
      if (self.state.utl != 0) {
        setTimeout(function() {
          self.wunlock(false, self.state.utl);
        }, 3000);
      }else{
        self.setState({dialog: false,eccAddress: "",amount: ""});
        event.emit("animate", lang.moneySent);
      }
    }).catch((err) => {
      log.error(err.message);
      self.setState({dialog: false,eccAddress: "",amount: ""});
      event.emit("animate", lang.moneySendError);
    });
  }

  renderDialog(){
    if(!this.state.dialog){
      return null;
    }else{
      return (
        <div className="mancha">
          <div className="dialog">
            <div className="header">
              <p className="title">{lang.popupMessageConfirmationRequired}</p>
               <ReactLoading className="loading" type="bars" color="#444"/>
            </div>
            <div className="body">
              <p className="desc">{lang.popupMessageSendConfirmation1} <span className="desc2">{this.state.amount}</span> {lang.popupMessageSendConfirmation2} <span className="desc2">{this.state.eccAddress}</span> ?</p>
              <div className="row">
                <div className="col-md-10 col-md-offset-1 input-group">
                  <input className="form-control inpuText" type="password" value={this.state.passPhrase} onChange={this.onPassPhraseChange} placeholder={lang.walletPassPhrase}/>
                </div>
                <p className="passPhraseError">{this.state.passPhraseError}</p>
              </div>
            </div>
            <div className="footer">
              <p className="button btn_cancel" onClick={this.cancelSend}>{lang.cancel}</p>
              <p className="button btn_confirm" onClick={this.confirmSend}>{lang.confirm}</p>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="send">
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-default">
              <div className="panel-body">
                <AddressBook friendClicked={this.friendClicked}/>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="panel panel-default">
              <div className="panel-body">
                <div className="input-group">
                  <input type="text" className="inpuText form-control" name="eccAddress" placeholder={lang.sendNameAddress} onChange={this._handleGenericFormChange} value={this.state.eccAddress}/>
                  <span className="input-group-btn" style={{paddingRight: "0px"}}>
                    <button className="greenBtn btn btn-success btn-raised" type="button" onClick={this.handleClear}> {lang.sendClear} </button>
                  </span>
                </div>
                <div className="input-group" style={{marginTop:"10px"}}>
                  <input type="number" className="inpuText form-control" name="amount" placeholder={lang.sendAmountToSend} onChange={this._handleGenericFormChange} value={this.state.amount}/>
                  <span className="input-group-btn" style={{paddingRight: "0px"}}>
                    <button className="greenBtn btn btn-success btn-raised" type="button" onClick={this._handleSendToAddress}> {lang.send} </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.renderDialog()}
      </div>
    );
  }
}

export default Send;
