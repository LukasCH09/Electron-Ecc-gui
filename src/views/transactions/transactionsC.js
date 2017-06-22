(() => {
  angular
    .module('ecc')
    .controller('transactionsC', transactionsC);

  function transactionsC($scope, rpc) {

    console.log("done");

    rpc.listtransactions("*", 100)
      .then(txlist => console.log(txlist[0]));

//    angular.forEach(obj, function(value, key) {
//      console.log(key + ': ' + value);
//    });


  }
})();
