(() => {
  angular
    .module('ecc')
    .controller('overviewC', overviewC);

  function overviewC($scope, exchanges, rpc) {
    this.wallet = {
      current: 0,
      pending: 0,
    };
    this.value = {};

    rpc.getInfo()
      .then(info => this.wallet.current = info.balance)
      .then(() => $scope.$apply());

    exchanges.getLastPrices()
      .then(lastPrices => this.value = lastPrices)
      .then(() => $scope.$apply());
  }
})();
