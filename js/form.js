'use strict';

(function () {
  var VALID_CAPACITY_TEXT = 'Выберите допустимое количество гостей';
  var TIMEOUT = 2000;
  var ENABLE_FORM_FIELDS = false;
  var DISABLE_FORM_FIELDS = true;
  var SELECTED_ROOM_IMDEX = 0;
  var VALID_CAPACITY = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var IMG_ALT = 'Фотографии жилья';
  var AVATAR_DAFAULT_SRC = 'img/muffin-grey.svg';
  var IMG_MARGIN = '3px';

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddres = adForm.querySelector('#address');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormCheckIn = adForm.querySelector('#timein');
  var adFormCheckOut = adForm.querySelector('#timeout');
  var adFormRoomsNumber = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var buttonReset = adForm.querySelector('.ad-form__reset');
  var avatarInput = document.querySelector('.ad-form input[name="avatar"]');
  var avatar = document.querySelector('.ad-form-header__preview img');
  var photoInput = document.querySelector('.ad-form input[name="images"]');
  var photoBox = document.querySelector('.ad-form__photo');
  var avatarDropZone = document.querySelector('.ad-form-header__drop-zone');
  var photoDropZone = document.querySelector('.ad-form__drop-zone');

  var AdTypePrices = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var AdFormPhoto = {
    WIDTH: 70,
    HEIGHT: 70,
    MARGIN: 3
  };

  var draggedItemElement;

  // Функция включения / отключения полей формы
  var changeAdFormFieldsState = function (value) {
    adFormFieldsets.forEach(function (item) {
      item.disabled = value;
    });
  };

  changeAdFormFieldsState(DISABLE_FORM_FIELDS);

  // Аватарка пользователя и фото жилья
  var checkFileOnImg = function (file) {
    var fileName = file.name.toLowerCase();

    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  var renderImage = function (file, elem) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      elem.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  var createHousingPhotosFragment = function (element) {
    var fragment = document.createDocumentFragment();

    Array.from(element.files).forEach(function (file) {

      if (checkFileOnImg(file)) {
        var imgElement = document.createElement('img');

        renderImage(file, imgElement);

        imgElement.width = AdFormPhoto.WIDTH;
        imgElement.height = AdFormPhoto.HEIGHT;
        imgElement.alt = IMG_ALT;
        imgElement.draggable = true;
        imgElement.style.marginRight = IMG_MARGIN;

        fragment.appendChild(imgElement);
      }
    });
    return fragment;
  };

  avatarInput.addEventListener('change', function () {
    renderImage(avatarInput.files[0], avatar);
  });

  avatarDropZone.addEventListener('dragenter', function (evt) {
    evt.target.style.outline = '2px solid red';
    evt.preventDefault();
  });

  avatarDropZone.addEventListener('dragleave', function (evt) {
    evt.target.style.outline = '';
    evt.preventDefault();
  });

  avatarDropZone.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  avatarDropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();

    evt.target.style.outline = '';

    renderImage(evt.dataTransfer.files[0], avatar);
  });

  photoInput.addEventListener('change', function () {
    photoBox.appendChild(createHousingPhotosFragment(photoInput));
  });

  photoDropZone.addEventListener('dragenter', function (evt) {
    evt.target.style.outline = '2px solid red';
    evt.preventDefault();
  });

  photoDropZone.addEventListener('dragleave', function (evt) {
    evt.target.style.outline = '';
    evt.preventDefault();
  });

  photoDropZone.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  photoDropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();

    evt.target.style.outline = '';

    var files = evt.dataTransfer;

    photoBox.appendChild(createHousingPhotosFragment(files));
  });

  photoBox.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName === 'IMG') {
      draggedItemElement = evt.target;
    }
  });

  photoBox.addEventListener('dragover', function (evt) {
    evt.preventDefault();
  });

  photoBox.addEventListener('drop', function (evt) {
    var target = evt.target;
    if (target.tagName === 'IMG') {
      if (target.offsetTop === draggedItemElement.offsetTop) {
        if (target.offsetLeft < draggedItemElement.offsetLeft) {
          target.insertAdjacentElement('beforebegin', draggedItemElement);
        } else if (target.offsetLeft > draggedItemElement.offsetLeft) {
          target.insertAdjacentElement('afterend', draggedItemElement);
        }
      } else {
        if (target.offsetTop < draggedItemElement.offsetTop) {
          target.insertAdjacentElement('beforebegin', draggedItemElement);
        } else if (target.offsetTop > draggedItemElement.offsetTop) {
          target.insertAdjacentElement('afterend', draggedItemElement);
        }
      }
    }
    evt.preventDefault();
  });

  // Удалить фотографии жилья
  var removeAdFormPhotos = function () {
    var photos = photoBox.querySelectorAll('img');
    photos.forEach(function (image) {
      image.remove();
    });
  };

  // Поля Кол-во комнат и Кол-во гостей
  var onRoomNumberFieldChange = function () {
    if (adFormCapacity.options.length > 0) {
      [].forEach.call(adFormCapacity.options, function (item) {
        item.selected = VALID_CAPACITY[adFormRoomsNumber.value][SELECTED_ROOM_IMDEX] === item.value;
        item.disabled = VALID_CAPACITY[adFormRoomsNumber.value].indexOf(item.value) === -1;
      });
    }
  };

  // Функция установки значения в поле адреса
  var setAddressFieldValue = function (pinState) {
    adFormAddres.value = window.pin.calculateCoordinates(pinState);
  };

  // Поля время Заезда и Выезда
  var onTimeInFieldChange = function () {
    adFormCheckOut.options.selectedIndex = adFormCheckIn.options.selectedIndex;
  };

  var onTimeOutFieldChange = function () {
    adFormCheckIn.options.selectedIndex = adFormCheckOut.options.selectedIndex;
  };

  // Поля Тип жилья и Цена
  var onTypeFieldChange = function () {
    var typeSelectedValue = adFormType.options[adFormType.selectedIndex].value;
    adFormPrice.placeholder = AdTypePrices[typeSelectedValue];
    adFormPrice.min = AdTypePrices[typeSelectedValue];
  };

  // Кнопка Очистить
  var onButtonResetClick = function () {
    window.map.reset();
    window.filter.disabledFilters();
    onRoomNumberFieldChange();
    onTypeFieldChange();
    removeAdFormPhotos();
  };

  // Успешная отправка
  var onSuccess = function () {
    window.map.reset();
    window.filter.disabledFilters();
    adForm.reset();
    removeAdFormPhotos();
    avatar.src = AVATAR_DAFAULT_SRC;
    onRoomNumberFieldChange();
    onTypeFieldChange();
    var successMessage = document.querySelector('.success');
    successMessage.classList.remove('hidden');
    var hideSuccessMessage = function () {
      successMessage.classList.add('hidden');
    };
    setTimeout(hideSuccessMessage, TIMEOUT);
  };

  // Кнопка Отправить
  var onAdFormSubmit = function (evt) {
    if (onRoomNumberFieldChange.disabled) {
      adFormCapacity.setCustomValidity(VALID_CAPACITY_TEXT);
      return;
    }
    window.backend.save(new FormData(adForm), onSuccess, window.error.show);
    evt.preventDefault();
  };

  var init = function () {
    adFormType.addEventListener('change', onTypeFieldChange);
    adFormCheckIn.addEventListener('change', onTimeInFieldChange);
    adFormCheckOut.addEventListener('change', onTimeOutFieldChange);
    adFormRoomsNumber.addEventListener('change', onRoomNumberFieldChange);
    changeAdFormFieldsState(ENABLE_FORM_FIELDS);
    buttonReset.addEventListener('click', onButtonResetClick);
    adForm.addEventListener('submit', onAdFormSubmit);
    setAddressFieldValue('dragged');
    adForm.classList.remove('ad-form--disabled');
  };

  var reset = function () {
    avatar.src = AVATAR_DAFAULT_SRC;
    adFormType.removeEventListener('change', onTypeFieldChange);
    adFormCheckIn.removeEventListener('change', onTimeInFieldChange);
    adFormCheckOut.removeEventListener('change', onTimeOutFieldChange);
    adFormRoomsNumber.removeEventListener('change', onRoomNumberFieldChange);
    adForm.removeEventListener('submit', onAdFormSubmit);
    buttonReset.removeEventListener('click', onButtonResetClick);
    photoInput.removeEventListener('change', createHousingPhotosFragment);
    changeAdFormFieldsState(DISABLE_FORM_FIELDS);
    setAddressFieldValue();
    removeAdFormPhotos();
    adForm.classList.add('ad-form--disabled');
  };

  window.form = {
    setAddressFieldValue: setAddressFieldValue,
    reset: reset,
    init: init
  };
})();
