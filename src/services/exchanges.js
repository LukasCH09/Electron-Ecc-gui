(() => {
  const request = require('request-promise-native');

  angular
    .module('ecc')
    .service('exchanges', exchanges);

  function exchanges() {
    const list = [
      {
        name: 'CoinExchange.io',
        url: 'https://www.coinexchange.io/api/v1/getmarketsummary?market_id=306',
      },
    ];

    return {
      getLastPrices() {
        const lastPrices = {};

        return Promise.all(list.map((exchange) => {
          const opts = {
            url: exchange.url,
            headers: {
              'User-Agent': 'request',
            },
          };

          return request(opts)
            .then((body) => {
              lastPrices[exchange.name] = JSON.parse(body).result.LastPrice;
            });
        }))
          .then(() => lastPrices);
      },
    };
  }
})();
