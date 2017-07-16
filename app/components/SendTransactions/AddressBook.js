import React, { Component } from 'react';
import low from '../../utils/low';
import Wallet from '../../utils/wallet';
import {traduction} from '../../lang/lang';
var event = require('../../utils/eventhandler');
var log = require('../../utils/log');

const lang = traduction();
const wallet = new Wallet();

class AddressBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendList: [],
      update: false
    };
    this._handleInput = this._handleInput.bind(this);
    this._handleToggleAddAddress = this._handleToggleAddAddress.bind(this);
    this.rowClicked = this.rowClicked.bind(this);
  }

  componentDidMount(){
    var flist = low.get('friends').value();
    this.setState({friendList: flist});
  }

  componentDidUpdate(){
    if(this.state.update){
      var flist = low.get('friends').value();
      this.setState({friendList: flist, update: false});
    }
  }

  componentWillUnmount(){
    this.state.requesting = false;
  }

  _handleInput(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({ [name]: value });
  }

  _handleToggleAddAddress() {
    var self = this;

    self.setState({requesting: true});

    wallet.validate(this.state.address).then((isAddressValid) => {
        if (isAddressValid.isvalid) {
        var tt = low.get('friends').find({ address: this.state.address }).value();
        if(tt != null){
          event.emit("animate",lang.addressExists);
        }else{
          var name = this.state.name;
          var address = this.state.address;

          if(address != ''){
            low.get('friends').push({ name: name, address: address }).write();
            self.setState({address:'', name:'', update: true});
          }
          
        }
      } else {
        event.emit("animate","Error: Invalid address");
      }
      self.setState({requesting: false});
    }).catch((err) => {
      log.error(err.message);
      if(this.state.requesting){
        self.setState({requesting: false});
        event.emit("animate",lang.addressValidadeError);
      }
    });  
  }

  rowClicked(friend,opt){
    var self = this;
    if(opt == "add"){
      event.emit("animate",lang.notificationAddressCopiedBelow);
      this.props.friendClicked(friend);
    }
    else{
      let friendArray = this.state.friendList;
      low.get('friends').remove({ address: friend.address }).write();
      this.setState({friendList: friendArray });
      event.emit("animate",lang.notificationAddressRemoved);
    }
  }


  render() {
    var self = this;
    var data = [];
    if(this.state.friendList != null){
      data = this.state.friendList;
    }
    return (
      <div>
        <div>
          <div className="input-group">
            <span className="input-group-btn" style={{verticalAlign: "middle"}}>
              <button className="greenBtn btn btn-success btn-raised" type="button" onClick={this._handleToggleAddAddress}>{lang.sendAddAddress}</button>
            </span>
            <div>
              <input className="inpuText form-control" onChange={this._handleInput} value={this.state.name} name='name' placeholder={lang.sendNameOptional} type="text"/>
              <input className="inpuText form-control" onChange={this._handleInput} value={this.state.address} name='address' placeholder={lang.address} type="text"/>
            </div>
          </div>
        </div>
        <div className="friends_table">
          <div className="row" style={{marginLeft:"0",marginRight:"0"}}>
            <div className="col-md-5 trans_col">
              <p className="header">{lang.sendName}</p>
            </div>
            <div className="col-md-6 trans_col">
              <p className="header">{lang.address}</p>
            </div>
            <div className="col-md-1 trans_col">
              
            </div>
          </div>
          {data.map(function(friend, index){
            var cr = "";
            if(index % 2 == 0){
              cr = "stripped";
            }
            return(
              <div key={"friend_"+index}>
                <div className={"row trans_row" + " " + cr}>
                  <div className="col-md-5 trans_col" onClick={self.rowClicked.bind(this,friend,"add")}>
                    <p style={{margin:"0px"}}><span className="desc1">{friend.name}</span></p>
                  </div>
                  <div className="col-md-6 trans_col" onClick={self.rowClicked.bind(this,friend,"add")}>
                    <p style={{margin:"0px"}}><span className="desc1">{friend.address}</span></p>
                  </div>
                  <div className="col-md-1 trans_col">
                    <p style={{margin:"0px"}}><span><i onClick={self.rowClicked.bind(this,friend,"remove")} className="delete_icon fa fa-trash-o" aria-hidden="true"></i></span></p>
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

export default AddressBook;
