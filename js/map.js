'use strict';

(function () {
  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_ARROW_HEIGHT = 22;
  var PIN_MAIN_START_X = 570;
  var PIN_MAIN_START_Y = 375;
  var LOCATION_X_MIN = 30;
  var LOCATION_X_MAX = 1160;
  var LOCATION_Y_MIN = 150;
  var LOCATION_Y_MAX = 500;

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');

  var pageState = 'disabled';

  var ads = [];
  var onLoad = function (data) {
    window.map.ads = data;
    window.filter.update();
  };

  // Переключение состояния страницы
  var enablePageState = function () {
    window.backend.load(onLoad, window.error.show);
    window.form.init();
    map.classList.remove('map--faded');
    window.filter.init();
    pageState = 'enabled';
  };

  // Активировать карту при перемещении главного маркера
  var onMapPinMainMouseDown = function (evt) {
    evt.preventDefault();

    var startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onDocumentMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');

      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var finishCoordinatesX = (mapPinMain.offsetLeft - shift.x);
      var finishCoordinatessY = (mapPinMain.offsetTop - shift.y);

      var isAvialibleX = finishCoordinatesX + (PIN_MAIN_WIDTH / 2) > LOCATION_X_MIN && finishCoordinatesX + (PIN_MAIN_WIDTH / 2) < LOCATION_X_MAX;
      var isAvialibleY = finishCoordinatessY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT > LOCATION_Y_MIN && finishCoordinatessY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT < LOCATION_Y_MAX;

      if (isAvialibleX) {
        mapPinMain.style.left = finishCoordinatesX + 'px';
      }

      if (isAvialibleY) {
        mapPinMain.style.top = finishCoordinatessY + 'px';
      }
      window.form.setAddressFieldValue('dragged');
    };

    var onDocumentMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (pageState === 'disabled') {
        enablePageState();
      }
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

  var reset = function () {
    map.classList.add('map--faded');
    adForm.reset();
    window.pin.remove();
    window.pin.init(PIN_MAIN_START_X, PIN_MAIN_START_Y);
    window.card.close();
    window.form.reset();
    window.filter.reset();
    pageState = 'disabled';
  };

  window.map = {
    ads: ads,
    reset: reset
  };
})();
