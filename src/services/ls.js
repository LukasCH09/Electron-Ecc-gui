(() => {
  angular
    .module('ecc')
    .service('ls', ls);

  function ls($window) {
    const prefix = 'ecc-';

    return {
      get,
      set,
      remove,
    };

    function get(key) {
      const item = $window.localStorage.getItem(prefix + key);
      return item ? JSON.parse(item) : item;
    }

    function set(key, value) {
      return $window.localStorage.setItem(prefix + key, JSON.stringify(value));
    }

    function remove(key) {
      return $window.localStorage.removeItem(prefix + key);
    }
  }
})();
