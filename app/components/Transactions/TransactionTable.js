import React, { Component } from 'react';
import Wallet from '../../utils/wallet';
import {exchanges, Interval} from '../../utils/exchange';
import low from '../../utils/low';
import $ from 'jquery';
import {traduction} from '../../lang/lang';
const settings = require('electron-settings');
var event = require('../../utils/eventhandler');
var log = require('../../utils/log');

const lang = traduction();
const wallet = new Wallet();


class TransactionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      canAutoUpdate: true,
      page: 1,
    }
    this.rowClicked = this.rowClicked.bind(this);
    //this.getAllTransactions();
  }

  componentDidMount(){
    var self = this;
    self.getAllTransactions();
    self.timerInfo = setInterval(function(){
      if(!self.state.requesting){
        self.getAllTransactions();
      }
    }, 5000);
  }


  componentWillUnmount() {
    this.state.requesting=false;
    this.state.canAutoUpdate=true;
    clearInterval(this.timerInfo);
  }


  getAllTransactions() {
    if(this.state.canAutoUpdate){
      var self = this;
      var countTras = self.props.countTras;

      self.setState({requesting: true });
      
      wallet.getTransactions(null,countTras,0).then((data) => {
        if(this.state.requesting){
          self.setState({transactions: data, requesting:false});
          event.emit("hide");
        }
      }).catch((err) => {
        log.error(err.message);
        if(this.state.requesting){
          event.emit("show",lang.notificationDaemonDownOrSyncing);
          self.setState({requesting: false });
        }
      });
    }  
  }


  renderStatus(opt){
    if(opt == 0){
      return(
        <span className="desc_p">{lang.pending}</span>
      );
    }else if (opt > 0) {
      return(
	       <span className="desc_c">{lang.confirmed}</span>
      );
    } else if (opt < 0) {
      return(
         <span className="desc_o">{lang.orphaned}</span>
      );
    }
  }

  rowClicked(index){
    if($('#trans_bottom_'+index).attr("sd") == "false" || $('#trans_bottom_'+index).attr("sd") == undefined){
      $('#trans_bottom_'+index).slideDown();
      $('#trans_bottom_'+index).attr("sd","true");
    }else{
      $('#trans_bottom_'+index).slideUp();
      $('#trans_bottom_'+index).attr("sd","false");
    }
  }

  orderTransactions(data){
    var aux = [];
    for (var i = data.length - 1; i >= 0; i--) {
      aux.push(data[i]);
    }
    return aux;
  }

  loadmore(){
    var self = this;
    var countTras = self.props.countTras;
    var currentTrans = [];

    var p = self.state.page+1;
    self.setState({requesting: true, page: p});

    wallet.getTransactions(null,countTras,countTras*p).then((data) => {
      if(self.state.requesting){
        if(data.length > 0){
          for (var i = 0; i < data.length ; i++) {
            currentTrans.push(data[i]);
          }
          event.emit("hide");
          self.setState({transactions: currentTrans});
        }else{
          event.emit("animate",lang.transactionsNoMoreToLoad);
        }
        self.setState({requesting:false, canAutoUpdate:false});
      }
    }).catch((err) => {
      log.error(err.message);
      if(this.state.requesting){
        event.emit("animate",lang.notificationDaemonDownOrSyncing);
        self.setState({requesting: false });
      }
    });  
  }

  loadless(){
    var self = this;
    var countTras = self.props.countTras;
    var currentTrans = [];

    if(self.state.page > 0){
      var p = self.state.page-1;
      self.setState({requesting: true, page: p});

      wallet.getTransactions(null,countTras,countTras*p).then((data) => {
        if(self.state.requesting){
          if(data.length > 0){
            for (var i = 0; i < data.length ; i++) {
              currentTrans.push(data[i]);
            }
            event.emit("hide");
             self.setState({transactions: currentTrans, requesting:false, canAutoUpdate:false});
          }
        }
      }).catch((err) => {
        log.error(err.message);
        if(this.state.requesting){
          event.emit("animate",lang.notificationDaemonDownOrSyncing);
          self.setState({requesting: false });
        }
      });
    } else{
      event.emit("animate",lang.transactionsNoMoreToLoad);
    }
  }

  render() {
    var h = this.props.h;
    var data = this.orderTransactions(this.state.transactions);
    var self = this;
    var today = new Date();

    return (
      <div className="transactions_table" style={{height: h}}>
        <div className="row" style={{marginLeft:"0",marginRight:"0"}}>
          <div className="col-md-5 trans_col">
            <p className="header">{lang.type}</p>
          </div>
          <div className="col-md-3 trans_col">
            <p className="header">{lang.amount}</p>
          </div>
          <div className="col-md-2 trans_col">
            <p className="header">{lang.status}</p>
          </div>
          <div className="col-md-2 trans_col">
            <p className="header">{lang.time}</p>
          </div>
        </div>
        {data.map(function(t, index){

          if(self.props.option == "all" || self.props.option == t.category || self.props.option == t.confirmations || (self.props.option == 1 && t.confirmations > 0) || (self.props.option == -1 && t.confirmations < 0)){
              var cr = "";
              if(index % 2 == 0){
                cr = "stripped";
              }
              var iTime = new Date(t.time*1000);
              
              var delta = Math.abs(today.getTime() - iTime.getTime()) / 1000;
              var days = Math.floor(delta / 86400);
              delta -= days * 86400;
              var hours = Math.floor(delta / 3600) % 24;
              delta -= hours * 3600;
              var minutes = Math.floor(delta / 60) % 60;


              var time = "";
              if (settings.get('settings.lang') == "fr") {
                time = lang.translationExclusiveForFrench + " ";
              }
              if (days > 0) {
                time += days + " ";
                if (days == 1){
                  time += lang.transactionsDay;
                }
                else{
                  time += lang.transactionsDays;
                }
              } else if (hours > 0) {
                time += hours + " ";
                if (hours == 1){
                  time += lang.transactionsHour;
                }
                else{
                  time += lang.transactionsHours;
                }
              } else if (minutes == 1) {
                time += minutes + " " + lang.transactionsMinute;
              } else {
                time += minutes + " " + lang.transactionsMinutes;
              }

              var category = t.category;
              if (category == "generate"){
                category = lang.stakedMin;
              }
              if (category == "staked"){
                category = lang.staked;
              }
              else if (category == "send"){
                category = lang.sent;
              }
              else if (category == "receive") {
                category = lang.received;
              }
              
              return(
                <div key={"transaction_"+index+"_"+t.txid}>
                  <div className={"row trans_row" + " " + cr}>
                    <div className="col-md-5 trans_col" onClick={self.rowClicked.bind(self,index)}>
                      <p style={{margin:"0px"}}><span className="desc1">{category}</span><span className="desc2"> ({t.address})</span></p>
                    </div>
                    <div className="col-md-3 trans_col" onClick={self.rowClicked.bind(self,index)}>
                      <p style={{margin:"0px"}}><span className="desc1">{t.amount} ecc</span></p>
                    </div>
                    <div className="col-md-2 trans_col" onClick={self.rowClicked.bind(self,index)}>
                      <p style={{margin:"0px"}}>{self.renderStatus(t.confirmations)}</p>
                    </div>
                    <div className="col-md-2 trans_col" onClick={self.rowClicked.bind(self,index)}>
                      <p style={{margin:"0px"}}><span className="desc1">{time}</span><span></span></p>
                    </div>
                    <div id={"trans_bottom_"+index} className="col-md-12 trans_col trans_bottom">
                      <div className="col-md-8 trans_col2">
                        <p style={{margin:"5px 0px 0px 0px"}}><span className="desc2">{lang.dateString}</span></p>
                        <p style={{margin:"0px 0px 5px 0px"}}><span className="desc3">{(new Date(t.time*1000)).toString()}</span></p>
                      </div>
                      <div className="col-md-4 trans_col2">
                        <p style={{margin:"5px 0px 0px 0px"}}><span className="desc2">{lang.confirmations}</span></p>
                        <p style={{margin:"0px 0px 5px 0px"}}><span className="desc3">{t.confirmations}</span></p>
                      </div>
                      <div className="col-md-8 trans_col2">
                        <p style={{margin:"5px 0px 0px 0px"}}><span className="desc2">{lang.transactionId}</span></p>
                        <p style={{margin:"0px 0px 5px 0px"}}><span className="desc3">{t.txid}</span></p>
                      </div>
                      <div className="col-md-4 trans_col2">
                        <p style={{margin:"5px 0px 0px 0px"}}><span className="desc2">{lang.transactionFee}</span></p>
                        <p style={{margin:"0px 0px 5px 0px"}}><span className="desc3">...</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              );
          }else{
            return null;
          }

        })}
      </div>
    );
  }
}

export default TransactionTable;
