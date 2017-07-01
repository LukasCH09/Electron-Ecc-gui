import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import low from '../../utils/low';
import Wallet from '../../utils/wallet';

const wallet = new Wallet();

class AddressBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendList: low.get('friends').value(),
      isAdding: false,
      buttonSign: 'Add Address'
    };


    this._handleInput = this._handleInput.bind(this);
    this._handleToggleAddAddress = this._handleToggleAddAddress.bind(this);


  }


  _init_() {
    // Initialize friendlist
    const friendListArray =  low.get('friends').value();
    console.log(friendListArray);
    this.setState({friendList: friendListArray });
  }

  _handleInput(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  async _handleToggleAddAddress() {
    if (this.state.isAdding === false){
      this.setState({ isAdding: true, buttonSign: 'Complete Add' });
    } else {
      let friendArray = this.state.friendList;
      // Need to validate first. Very possible to use async
      const isAddressValid = await wallet.validate(this.state.address);
      if (isAddressValid.isvalid === false) {
        // Put a toastr function here
      } else {
        low.get('friends').push({ label: this.state.label, address: this.state.address }).write();
        friendArray.push({ label: this.state.label, address: this.state.address });
        this.setState({ isAdding: false, buttonSign: 'Add Address', friendList: friendArray });
      }


    }
  }

  render() {
    return (
      <div>
        <div className="input-group">
          <span className="input-group-btn">
            <button className="btn btn-success btn-raised" type="button" onClick={this._handleToggleAddAddress}> {this.state.buttonSign} </button>
          </span>
          {this.state.isAdding &&
            <div>
              <input className="form-control" onChange={this._handleInput} name='label' placeholder="Label" type="text"/>
              <input className="form-control" onChange={this._handleInput} name='address' placeholder="ECC Address" type="text"/>
            </div>

          }

        </div>

        <BootstrapTable data={this.state.friendList}  height='400' striped hover>
          <TableHeaderColumn width='50%' isKey dataField='label'>Label</TableHeaderColumn>
          <TableHeaderColumn width='50%' dataField='address'>Address</TableHeaderColumn>

        </BootstrapTable>
      </div>
    );
  }
}

export default AddressBook;
