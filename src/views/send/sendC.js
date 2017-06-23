(() => {
  angular
    .module('ecc')
    .controller('sendC', sendC);

  function sendC(rpc, ls, $scope) {
    this.editing = null;
    this.addressbook = ls.get('addressbook') || [];

    this.selectPayTo = (address) => {
      this.payTo = address;
    };

    this.addAddress = () => {
      this.addressbook.push({
        label: '',
        address: '',
      });

      this.editAddress(this.addressbook.length - 1);
    };

    this.save = (index) => {
      if (index !== undefined) {
        rpc.validateAddress(this.addressbook[index].address)
          .then((data) => {
            if (!data.isvalid) {
              this.addressError = index;
              $scope.$apply();
            } else {
              this.addressError = null;
              this.editing = null;
              $scope.$apply();
              ls.set('addressbook', this.addressbook);
            }
          });
      } else {
        this.addressError = null;
        this.editing = null;
        ls.set('addressbook', this.addressbook);
      }
    };

    this.removeAddress = (index, event) => {
      if (event) event.stopPropagation();
      this.addressbook.splice(index, 1);
      this.save();
    };

    this.editAddress = (index, event) => {
      if (event) event.stopPropagation();
      this.editing = index;
    };
  }
})();
