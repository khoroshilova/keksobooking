'use strict';

(function () {

  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_ARROW_HEIGHT = 22;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');
  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');

  // Создать элемент метки
  var makePinItem = function (ad) {
    var pinItem = pinTemplate.cloneNode(true);
    var pinAvatar = pinItem.querySelector('img');

    pinItem.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
    pinItem.style.top = ad.location.y - PIN_HEIGHT + 'px';
    pinAvatar.src = ad.author.avatar;
    pinAvatar.alt = ad.offer.title;

    pinItem.addEventListener('click', function () {
      if (map.querySelector('.map__card')) {
        window.card.close();
      }
      window.card.open(ad);
      pinItem.classList.add('map__pin--active');
    });

    return pinItem;
  };

  // Функция вычисления координат главной метки
  var mapPinMainCalculateCoordinates = function (pinState) {
    var coordinatesX = mapPinMain.offsetLeft + (PIN_MAIN_WIDTH / 2);
    var coordinatesY = mapPinMain.offsetTop + (pinState === 'dragged' ? PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT : PIN_MAIN_HEIGHT / 2);

    return coordinatesX + ', ' + coordinatesY;
  };

  // Функция отрисовки меток объявлений
  var renderPins = function (adsArray) {
    var fragment = document.createDocumentFragment();

    adsArray.forEach(function (it) {
      fragment.appendChild(window.pin.make(it));
    });

    return fragment;
  };

  // Функция удаления отрисованных меток
  var removePins = function () {
    var pins = mapPinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (pin) {
      pin.remove();
    });
  };

  // Координаты главной метки
  var mapPinMainInit = function (x, y) {
    mapPinMain.style.left = x + 'px';
    mapPinMain.style.top = y + 'px';
  };

  window.pin = {
    make: makePinItem,
    calculateCoordinates: mapPinMainCalculateCoordinates,
    render: renderPins,
    remove: removePins,
    init: mapPinMainInit
  };
})();
