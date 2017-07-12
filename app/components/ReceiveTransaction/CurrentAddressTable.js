import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import faker from 'faker';
const {clipboard} = require('electron');

import Wallet from '../../utils/wallet';
import low from '../../utils/low';

const wallet = new Wallet();

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

class CurrentAddresses extends Component {
  constructor(props) {
    super(props);
    console.log();
    this.state = {
      sample:createTableData(),
      existingAddresses: []
    }

    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: this.onRowSelect
    };

    this.state['rowSettings'] = selectRowProp;


    this.getAllAddresses();
  }


  onRowSelect(row, isSelected, e) {
    low.get('address').push({name: row['account'], address: row['address']}).write();
    clipboard.writeText(row['address']);
  }
/**
 * account
 * address
 * amount
 * confirmations
 */


  async getAllAddresses(){
    let accounts = await wallet.listAllAccounts();
    // console.log(accounts);
    this.setState({existingAddresses: accounts})
  }



  render() {
    return (
      <div>
        <BootstrapTable data={this.state.existingAddresses} selectRow={ this.state.rowSettings } height='200' striped hover>
          <TableHeaderColumn width='25%' isKey={ true } filter={ { type: 'TextFilter', delay: 1000 } } dataSort={ true } dataField='account'>Account</TableHeaderColumn>
          <TableHeaderColumn width='40%' dataSort={ true } filter={ { type: 'TextFilter', delay: 1000 } } dataField='address'>Address</TableHeaderColumn>
          <TableHeaderColumn width='25%' dataSort={ true } filter={ { type: 'NumberFilter', delay: 1000, numberComparators: [ '=', '>', '<=' ] } dataField='amount'>Amount</TableHeaderColumn>
          <TableHeaderColumn width='15%' dataSort={ true } dataField='confirmations'>Confirmations</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default CurrentAddresses;
