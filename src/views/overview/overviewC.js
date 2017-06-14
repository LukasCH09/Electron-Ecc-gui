(() => {
  angular
    .module('ecc')
    .controller('overviewC', overviewC);

  function overviewC($scope, exchanges) {
    this.wallet = {
      current: 336403,
      pending: 0,
    };

    this.value = {};

    exchanges.getLastPrices()
      .then(lastPrices => this.value = lastPrices)
      .then(() => $scope.$apply());
  }
})();
