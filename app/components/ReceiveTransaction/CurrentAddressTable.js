import React, { Component } from 'react';
import Wallet from '../../utils/wallet';
import {traduction} from '../../lang/lang';
var event = require('../../utils/eventhandler');

const lang = traduction();
const wallet = new Wallet();
const {clipboard} = require('electron');

class CurrentAddresses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      existingAddresses: []
    }
    this.rowClick = this.rowClick.bind(this);
  }

  componentDidMount(){
    if(!this.state.requesting){
      this.getAllAddresses();
    }
  }

  componentWillUnmount(){
    this.state.requesting = false;
  }


  rowClick(address) {
    event.emit("animate",lang.notificationAddressCopiedToClipboard);
    clipboard.writeText(address);
  }


  getAllAddresses(){
    var self = this;
    self.setState({requesting:true});
    wallet.listAllAccounts().then((data) => {
      this.setState({existingAddresses: data, requesting:false});
    }).catch((err) => {
      console.log(err);
      if(this.state.requesting){
        self.setState({requesting:false});
        event.emit("animate",lang.notificationDaemonDownOrSyncing);
      }
    });
  }


  render() {
    var self = this;
    var data = [];
    if(this.state.existingAddresses != null){
      data = this.state.existingAddresses;
    }
    return (
      <div>
        <div className="addresses_table">
          <div className="row" style={{marginLeft:"0",marginRight:"0"}}>
            <div className="col-md-2 trans_col">
              <p className="header">{lang.account}</p>
            </div>
            <div className="col-md-5 trans_col">
              <p className="header">{lang.address}</p>
            </div>
            <div className="col-md-3 trans_col">
              <p className="header">{lang.amount}</p>
            </div>
            <div className="col-md-2 trans_col">
              <p className="header">{lang.confirmations}</p>
            </div>
          </div>
          {data.map(function(address, index){
            var cr = "";
            if(index % 2 == 0){
              cr = "stripped";
            }
            return(
              <div key={"address_"+index} onClick={self.rowClick.bind(self,address.address)}>
                <div className={"row trans_row" + " " + cr}>
                  <div className="col-md-2 trans_col">
                    <p style={{margin:"0px"}}><span className="desc1">{address.account}</span></p>
                  </div>
                  <div className="col-md-5 trans_col">
                    <p style={{margin:"0px"}}><span className="desc1">{address.address}</span></p>
                  </div>
                  <div className="col-md-3 trans_col">
                    <p style={{margin:"0px"}}><span className="desc1">{address.amount}</span></p>
                  </div>
                  <div className="col-md-2 trans_col">
                    <p style={{margin:"0px"}}><span className="desc1">{address.confirmations}</span></p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default CurrentAddresses;
