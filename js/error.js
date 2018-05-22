'use strict';

(function () {
  var SHOW_ERROR_TIMEOUT = 3500;

  var createErrorMessage = function (onError) {
    var errorItem = document.createElement('div');
    errorItem.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    errorItem.style.position = 'fixed';
    errorItem.style.width = '100%';
    errorItem.style.top = 0;
    errorItem.style.left = 0;
    errorItem.style.fontSize = '24px';
    errorItem.style.color = 'white';
    errorItem.textContent = onError;
    document.body.insertAdjacentElement('afterbegin', errorItem);
    var removeerrorItem = function () {
      errorItem.classList.add('hidden');
    };
    setTimeout(removeerrorItem, SHOW_ERROR_TIMEOUT);
  };

  window.error = {
    show: createErrorMessage
  };
})();
