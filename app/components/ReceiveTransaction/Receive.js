import React, { Component } from 'react';
import CurrentAddresses from './CurrentAddressTable';
import low  from '../../utils/low';
import Wallet  from '../../utils/wallet';
const {clipboard} = require('electron');

const wallet = new Wallet();


class Receive extends Component {

  constructor(props){
    super(props);
    this.state = {
      nameOfNewAddress: '',
      theNewAddress: ''
    };
    this._handleAddressClick = this._handleAddressClick.bind(this);
    this._handleCopyAddress = this._handleCopyAddress.bind(this);
    this._handleGenericFormChange = this._handleGenericFormChange.bind(this);
  }

  _handleAddressClick() {
    const self = this;
    let name;
    console.log(self);
    if (self.state.nameOfNewAddress == '')
      name = null;
    else
      name = self.state.nameOfNewAddress;
    wallet.createNewAddress(name).then((newAddress)=>{
      self.setState({ theNewAddress: newAddress });
      // Save to lowdb here
      low.get('address').push({name: name, address: newAddress}).write();
      // TODO: Tell people it's copied eventually
      // Also add to the clipboard
      let lastAddress = low.get('address').find({name: name}).value();

      // console.log(low.get('address'));
      console.log(lastAddress);

      clipboard.writeText(newAddress);
    });


  }

  _handleCopyAddress(event) {
    clipboard.writeText(event.target.value);
  }

  _handleGenericFormChange(event) {
    // console.log(this);
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value});
  }

  render() {
    return (
      <div>

        <div className="row">
          <div className="col-lg-12">
            <h3>NewAddress</h3>
          </div>

          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-body">

                <div className="col-lg-12 col-md-12">

                  <div className="col-md-12">
                    <span>Address Name</span>
                    <br/>

                    <input type="text" className="form-control col-md-12" name="nameOfNewAddress" placeholder="(Optional) Name" onChange={this._handleGenericFormChange} value={this.state.nameOfNewAddress} />
                    <br/>
                    <br/>
                  </div>
                </div>



                <div className="col-lg-12 col-md-12">
                  <div className="col-md-12">


                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="address" value={this.state.theNewAddress} onClick={this._handleCopyAddress} disabled />
                      <span className="input-group-btn">
                        <button className="btn btn-success btn-raised" type="button" onClick={this._handleAddressClick} > Create New Address </button>
                      </span>
                    </div>

                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>


        <div className="row">
          <div className="col-lg-12">
            <h3>Existing Addresses</h3>
          </div>

          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-body">

                <CurrentAddresses />



              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Receive;
