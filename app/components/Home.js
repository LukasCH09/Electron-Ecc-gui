// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import faker from 'faker';

import TransactionTable from './Transactions/TransactionTable';
import styles from './Home.css';
import Wallet  from '../utils/wallet';
import {exchanges, Interval} from '../utils/exchange';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


const wallet = new Wallet();
require('./Home.css');


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




export default class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentECC: 0,
      pendingECC: 0,
      sample: createTableData(),
      currentExchangePrice: {
        'coinexchange': 0
      }
    };

    // const wall = new Wallet();

    const self = this;
    wallet.balanceCurrentBalance().then((data) =>{
      console.log(data);
      self.state.currentECC = data;
    }).catch((err) => {
      console.log(err);
      alert(err.message);
    });
    this.exchangeInterval();
    this.totalECC = this.totalECC.bind(this);
  }

  exchangeInterval() {
    const self = this;

    exchanges().getLastPrices().then((data) => {
      let currentExchangePrice = self.state.currentExchangePrice;
      currentExchangePrice['coinexchange'] = data['CoinExchange.io'];
      self.setState({
        currentExchangePrice: currentExchangePrice
      });

    }).catch((error) => {
      alert(error);
    });
    // Interval()
    setInterval(() => {
      exchanges().getLastPrices().then((data) => {
        let currentExchangePrice = self.state.currentExchangePrice;
        currentExchangePrice['coinexchange'] = data['CoinExchange.io'];
        if(self.refs.coinexio)
          self.setState({
            currentExchangePrice: currentExchangePrice
          });

      }).catch((error) => {
        alert(error);
      });
    }, 3000);


    // Exchange.exchanges().then((data) => {
    //   console.log(data);
    // }).catch((err) => {
    //   console.log(err);
    // });
  }

  totalECC() {
    return this.state.currentECC + this.state.pendingECC;
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6 col-lg-6 col-xs-6">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>Balance</h3>
                <hr />
                <div className="col-lg-4 col-xs-4 col-md-4">
                  <span>Current:</span>
                </div>
                <div className="col-lg-8 col-md-8 col-xs-8  text-right">
                  {this.state.currentECC} ECC
                </div>

                <div className="col-lg-4 col-xs-4 col-md-4">
                  <span>Pending:</span>
                </div>
                <div className="col-lg-8 col-md-8 col-xs-8 text-right">
                  {this.state.pendingECC} ECC
                </div>
                <br/>
                <br/>
                <hr />
                <div className="col-lg-4 col-xs-4 col-md-4">
                  <span>Total:</span>
                </div>
                <div className="col-lg-8 col-md-8 col-xs-8 text-right">
                  {this.totalECC()} ECC
                </div>
              </div>
            </div>
          </div>


          <div className="col-md-6 col-lg-6 col-xs-6">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>Current Value</h3>
                <hr />
                <div className="col-lg-4 col-xs-4 col-md-4">
                  <span>CoinExchange.io:</span>
                </div>
                <div className="col-lg-8 col-md-8 col-xs-8 text-right" ref="coinexio">
                  {this.state.currentExchangePrice.coinexchange}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 ">
            <div className="panel panel-default transaction-container">
              <div className="panel-body">
                <h3>Recent Transactions</h3>
                <hr />

                <TransactionTable />

                <hr />
              </div>
            </div>
          </div>
        </div>


      </div>
    );
  }
}
