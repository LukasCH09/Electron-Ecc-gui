(() => {
  const shell = require('electron').shell;

  angular
    .module('ecc')
    .directive('externalLink', externalLink);

  function externalLink() {
    return {
      link(scope, element, attrs) {
        element.on('click', () => {
          shell.openExternal(attrs.externalLink);
        });
      },
    };
  }
})();
