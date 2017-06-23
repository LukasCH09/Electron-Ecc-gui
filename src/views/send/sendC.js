(() => {
  angular
    .module('ecc')
    .controller('sendC', sendC);

  function sendC(rpc, ls) {
    this.editing = null;
    this.addressbook = ls.get('addressbook') || [
      {
        label: 'CoinExchange',
        address: '9448q7has48j4',
      },
      {
        label: 'Bittrex',
        address: 'adu894uuj9adsa',
      },
      {
        label: 'Tony',
        address: 'dfi0dw9k4nf0',
      },
    ];

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

    this.save = () => {
      this.editing = null;
      ls.set('addressbook', this.addressbook);
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
