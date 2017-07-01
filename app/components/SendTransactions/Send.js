import React, { Component } from 'react';
import AddressBook from './AddressBook';
import Wallet  from '../../utils/wallet';

const wallet = new Wallet();

class Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eccAddress: '',
      amount: 0
    };

    this._handleGenericFormChange = this._handleGenericFormChange.bind(this);
    this._handleSendToAddress = this._handleSendToAddress.bind(this);
  }

  _handleGenericFormChange(event) {
    console.log(this.state);
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value });
  }

  async _handleSendToAddress() {
    if (this.state.eccAddress !== ''){
      // Check for address validity here
      const validation = await wallet.validate(this.state.eccAddress);
      if (validation.isvalid === false) {
        // TODO: Send alerts in a toastr
        alert('invalid address');

        return;
      }

      if (this.state.amount > 0) {
        // Send
        wallet.sendMoney(this.state.eccAddress, this.state.amount).then((res, reject) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
          alert('Err: ' + err.message);
        });
        return;
        // console.log(transreceive);

        // return
      }

      // TODO: Send alerts in a toastr like way
      alert('amount less than or equal to 0'); return;

      // Don't allow send here
      // return
    } else {
      // Don't allow send here
      alert("empty address");
      // return
    }
  }

  render() {
    return (
      <div>
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-body">
              <AddressBook />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-body">
              <input type="text" className="form-control col-md-12" name="eccAddress" placeholder="ECC Address" onChange={this._handleGenericFormChange} value={this.state.eccAddress}/>
              <div className="input-group">
                <input type="number" className="form-control" name="amount" placeholder="Amount" onChange={this._handleGenericFormChange} value={this.state.amount}/>
                <span className="input-group-btn">
                  <button className="btn btn-success btn-raised" type="button" onClick={this._handleSendToAddress}> Send </button>
                </span>
              </div>
            </div>




          </div>
        </div>

      </div>
    );
  }
}

export default Send;
