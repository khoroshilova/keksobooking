'use strict';

(function () {
  var PINS_COUNT = 5;
  var ANY_VALUE = 'any';

  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapFiltersContainer = document.querySelector('.map__filters');
  var housingType = mapFiltersContainer.querySelector('#housing-type');
  var housingPrice = mapFiltersContainer.querySelector('#housing-price');
  var housingRoomsNumber = mapFiltersContainer.querySelector('#housing-rooms');
  var housingGuestsNumber = mapFiltersContainer.querySelector('#housing-guests');

  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  // Неактивное состояние фильтров
  var changeDisabledAttr = function (elem) {
    switch (elem.disabled) {
      case true:
        elem.disabled = false;
        break;
      case false:
        elem.disabled = true;
        break;
    }
  };
  var disabledFilters = function () {
    Array.prototype.forEach.call(mapFiltersContainer, function (elem) {
      changeDisabledAttr(elem);
    });
  };
  disabledFilters();

  var updatePins = function () {
    if (map.querySelector('.map__card')) {
      window.card.close();
    }
    window.pin.remove();
    var filteredPins = [];
    var checkedFeatures = Array.from(mapFiltersContainer.querySelectorAll('input[type=checkbox]:checked'));
    window.map.ads.some(function (it) {
      if (getType(it) && getPrice(it) && getRooms(it) && getCapacity(it) && getFeatures(it, checkedFeatures)) {
        filteredPins.push(it);
      }
      return filteredPins.length >= PINS_COUNT;
    });
    mapPinsContainer.appendChild(window.pin.render(filteredPins));
  };

  var getType = function (ad) {
    return housingType.value === ANY_VALUE || housingType.value === ad.offer.type;
  };

  var getPrice = function (ad) {
    switch (housingPrice.value) {
      case 'low':
        return Price.LOW > ad.offer.price;
      case 'middle':
        return Price.LOW <= ad.offer.price && Price.HIGH >= ad.offer.price;
      case 'high':
        return Price.HIGH < ad.offer.price;
      default:
        return true;
    }
  };

  var getRooms = function (ad) {
    return housingRoomsNumber.value === ANY_VALUE || parseInt(housingRoomsNumber.value, 10) === ad.offer.rooms;
  };

  var getCapacity = function (ad) {
    return housingGuestsNumber.value === ANY_VALUE || parseInt(housingGuestsNumber.value, 10) <= ad.offer.guests;
  };

  var getFeatures = function (ad, checkedFeatures) {
    return checkedFeatures.every(function (item) {
      return ad.offer.features.indexOf(item.value) !== -1;
    });
  };

  var onMapFilterChange = function () {
    window.debounce(updatePins);
  };

  var init = function () {
    mapFiltersContainer.addEventListener('change', onMapFilterChange);
    disabledFilters();
  };

  var reset = function () {
    mapFiltersContainer.removeEventListener('change', onMapFilterChange);
    mapFiltersContainer.reset();
  };

  window.filter = {
    update: updatePins,
    init: init,
    reset: reset,
    disabledFilters: disabledFilters
  };
})();
