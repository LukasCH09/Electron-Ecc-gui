(() => {
  const bitcoin = require('bitcoin-promise');

  angular
    .module('ecc')
    .service('rpc', rpc);

  function rpc() {
    const client = new bitcoin.Client({
      host: 'localhost',
      port: 19119,
      user: 'sample1',
      pass: 'sample2',
    });

    return client;
  }
})();
