import Client from 'bitcoin-core';
const client = new Client({
  port: 19119,
  // network:"testnet",

  username: 'yourusername',
  password: 'yourpassword'

});


export default class Wallet {

  constructor() {

  }

  /**
   * @param {Object} accountObject - the current account we'll use with other files
   */
  setCurrentAccount(accountObject) {
    return accountObject;
  }

  /**
   * Allow the user to get balance
   */
  balanceCurrentBalance() {
    return new Promise((resolve, reject) => {
      client.getBalance().then((balance) => {
        resolve(balance);
        return '';
      }).catch((err) => {
        reject(err);
      });
    });
  }

  pendingBalance() {
    return new Promise((resolve, reject) => {
      client.getBalance().then((balance) => {
        resolve(balance);
        return balance;
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async getTransactions(account) {
    let transactions;
    if (account == null) {
      transactions = await client.listTransactions();
    } else {
      transactions = await client.listTransactions(account);
    }
    return transactions;
  }

  async listAllAccounts() {
    const addresses = await client.listReceivedByAddress(0, true);
    return addresses;
  }

  async createNewAddress(nameOpt) {
    let name = nameOpt || null;
    let newAddress;
    if(name===null){
      // Create address without name
      newAddress = await client.getNewAddress();
    }else{
      // Create the new address with the name
      newAddress = await client.getNewAddress(name);
    }
    return newAddress;
  }

  async sendMoney(sendAddress, amount) {
    const amountNum = parseFloat(amount);
    const sendAddressStr = '' + sendAddress;
    await client.sendToAddress(sendAddressStr, amountNum);


  }

  async validate(address) {
    const result = await client.validateAddress(address);

    return result;
  }

  async walletpassphrase(passphrase, time){
    try{
      const ntime = parseInt(time)
      const result = await client.walletPassphrase(passphrase, ntime);
      return result;
    }
    catch(err){
      return err;
    }
  }

  async getblockcount(){
    const result = await client.getBlockCount();
    return result;
  }

  async getblockhash(hash){
    const result = await client.getBlockHash(hash);
    return result;
  }

  async walletlock(){
    try {
      const result = await client.walletLock();
      return result;
    }
    catch(err){
      return err;
    }
  }
  async getpeerinfo(){
    const result = await client.getPeerInfo();
    return result;
  }
}
