'use strict';

(function () {
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;
  var RESPONSE_STATUS = 'Статус ответа: ';
  var ERROR_STATUS = 'Ошибка';
  var TIME_UNIT = 'мс';

  var StatusCode = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    ACCESS_DENIED: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    APPLICATION_ERROR: 503,
  };

  var StatusAnswer = {
    BAD_REQUEST_ANSWER: 'В запросе ошибка.',
    ACCESS_DENIED_ANSWER: 'Доступ запрещён. У вас недостаточно прав.',
    NOT_FOUND_ANSWER: 'Данные по запросу не найдены.',
    SERVER_ERROR_ANSWER: 'Внутренняя ошибка сервера',
    APPLICATION_ERROR_ANSWER: 'Сервис временно недоступен',
  };

  var ErrorText = {
    CONNECTION_ERROR: 'Произошла ошибка соединения',
    REQUEST_TIME: 'Запрос не успел выполниться за ',
  };

  var makeXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case StatusCode.SUCCESS:
          onLoad(xhr.response);
          break;
        case StatusCode.BAD_REQUEST:
          onError(RESPONSE_STATUS + xhr.status, StatusAnswer.BAD_REQUEST_ANSWER);
          break;
        case StatusCode.ACCESS_DENIED:
          onError(RESPONSE_STATUS + xhr.status, StatusAnswer.ACCESS_DENIED_ANSWER);
          break;
        case StatusCode.NOT_FOUND:
          onError(RESPONSE_STATUS + xhr.status, StatusAnswer.NOT_FOUND_ANSWER);
          break;
        case StatusCode.SERVER_ERROR:
          onError(RESPONSE_STATUS + xhr.status, StatusAnswer.SERVER_ERROR_ANSWER);
          break;
        case StatusCode.APPLICATION_ERROR:
          onError(RESPONSE_STATUS + xhr.status, StatusAnswer.APPLICATION_ERROR_ANSWER);
          break;
        default:
          onError(RESPONSE_STATUS + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(ERROR_STATUS, ErrorText.CONNECTION_ERROR);
    });
    xhr.addEventListener('timeout', function () {
      onError(ERROR_STATUS, ErrorText.REQUEST_TIME + xhr.timeout + TIME_UNIT);
    });

    return xhr;
  };

  var loadData = function (onLoad, onError) {
    var xhr = makeXHR(onLoad, onError);
    xhr.open('GET', GET_URL);
    xhr.send();
  };

  var saveData = function (data, onLoad, onError) {
    var xhr = makeXHR(onLoad, onError);
    xhr.open('POST', POST_URL);
    xhr.send(data);
  };

  window.backend = {
    load: loadData,
    save: saveData
  };
})();
