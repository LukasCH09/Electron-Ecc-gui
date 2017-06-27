(() => {
  angular.module('ecc', [
    'ui.router',
  ])
    .config(Config);

  function Config($locationProvider, $urlRouterProvider, $stateProvider) {
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/#');
    console.log("Pooling all state providers")
    $stateProvider
      .state('overview', {
        url: '/',
        templateUrl: 'views/overview/overviewV.html',
        controller: 'overviewC as overviewC',
      })
      .state('send', {
        url: '/send',
        templateUrl: 'views/send/sendV.html',
        controller: 'sendC as sendC',
      })
      .state('receive', {
        url: '/receive',
        templateUrl: 'views/receive/receiveV.html',
        controller: 'receiveC as receiveC',
      })
      .state('transactions', {
        url: '/transactions',
        templateUrl: 'views/transactions/transactionsV.html',
        controller: 'transactionsC as transactionsC',
      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about/aboutV.html',
      });
  }
})();
