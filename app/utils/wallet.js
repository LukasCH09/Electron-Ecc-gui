import Client from 'bitcoin-core';
const client = new Client({
  host: "127.0.0.1",
  port: 19119,
  username: 'yourusername',
  password: 'yourpassword'

});


export default class Wallet {

  constructor() {}

  help() {
    return new Promise((resolve, reject) => {
      client.help().then((data) => {
        resolve(data);
        return '';
      }).catch((err) => {
        reject(err);
      });
    });
  }

  command(batch){
    return new Promise((resolve, reject) => {
      client.command(batch).then((responses) => {
        resolve(responses);
        return '';
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getInfo() {
    return new Promise((resolve, reject) => {
      client.getInfo().then((data) => {
        resolve(data);
        return '';
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getTransactions(account, count, skip) {
    return new Promise((resolve, reject) => {
      var a = account;
      if (a == null) {
        a = "*";
      }
      client.listTransactions(a, count, skip).then((transactions) => {
        resolve(transactions);
        return '';
      }).catch((err) => {
        reject(err);
      });
    });
  }

  listAllAccounts() {
    return new Promise((resolve, reject) => {
      client.listReceivedByAddress(0, true).then((addresses) => {
        resolve(addresses);
        return '';
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async createNewAddress(nameOpt) {
    let name = nameOpt || null;
    let newAddress;
    if (name === null) {
      newAddress = await client.getNewAddress();
    } else {
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

  async getblockcount() {
    const result = await client.getBlockCount();
    return result;
  }

  async getblockhash(hash) {
    const result = await client.getBlockHash(hash);
    return result;
  }

  async getpeerinfo() {
    const result = await client.getPeerInfo();
    return result;
  }

  async encryptWallet(passphrase) {
    try {
      const result = await client.encryptWallet(passphrase);
      return result;
    } catch (err) {
      return err;
    }
  }

  async walletlock() {
    try {
      const result = await client.walletLock();
      return result;
    } catch (err) {
      return err;
    }
  }

  async walletpassphrase(passphrase, time) {
    try {
      const ntime = parseInt(time)
      const result = await client.walletPassphrase(passphrase, ntime);
      return result;
    } catch (err) {
      return err;
    }
  }
}
