import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import faker from 'faker';

import Wallet from '../../utils/wallet';
import CurrentAddresses from '../ReceiveTransaction/CurrentAddressTable';
import TransTable from './TransactionTable';

const wallet = new Wallet();
require('./Transactions.css');

function createTableData() {
  const arrayOfTransactions = [];

  for (let i = 0; i < 3; i++) {
    const newDate = faker.date.past().toISOString('YYYY-MM-DDTHH:mm:ss');
    const fakeNumber = 2;
    const trans = faker.finance.bitcoinAddress();
    const amountSent = 3;
    // newDate = newDate.parse('YYYY-MM-DDTHH:mm:ss')

    const transaction = {
      date: newDate,
      confirmations: fakeNumber,
      transactionId: trans,
      amount: amountSent
    };
    arrayOfTransactions.push(transaction);
  }

  return arrayOfTransactions;
  // faker.fake('{{name.lastName}}, {{name.firstName}} {{name.suffix}}');
}




class Transaction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sample: createTableData()
    };

    console.log(this.state);
  }

  render() {
    return (
      <div>
        <div className="col-md-12">
          <h1>Transaction</h1>

        </div>

        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-body">
              <TransTable />
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-body">
              <h3>Current Accounts</h3>
              <CurrentAddresses />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Transaction;
