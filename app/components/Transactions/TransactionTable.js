import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import faker from 'faker';

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

class TransactionTable extends Component {
  constructor(props) {
    super(props);
    console.log();
    this.state = {
      sample:createTableData(),
      transactions: []
    }

    const selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: this.onRowSelect,
      tableSize: '200'
    };
    if (this.props.tableHeight != null){
      this.state.tableSize = this.props.tableHeight.toString();
    }
    this.state['rowSettings'] = selectRowProp;


    this.getAllTransactions();
  }


  onRowSelect(row, isSelected, e) {
    low.get('address').push({name: row['account'], address: row['address']}).write();
  }
/**
 * account
 * address
 * amount
 * confirmations
 */


  async getAllTransactions() {

    let transactions = await wallet.getTransactions();
    console.log(transactions);
    // callTimes
    this.setState({transactions: transactions });
  }



  render() {
    return (
      <div>
        <BootstrapTable data={this.state.transactions} selectRow={ this.state.rowSettings } height='200' striped hover>
          <TableHeaderColumn width='25%' isKey dataField='date'>Date</TableHeaderColumn>
          <TableHeaderColumn width='25%' dataField='transactions'>Transactions</TableHeaderColumn>
          <TableHeaderColumn width='25%' dataField='amount'>Amount</TableHeaderColumn>
          <TableHeaderColumn width='25%' dataField='confirmations'>Confirmations</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default TransactionTable;
