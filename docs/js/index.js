"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Основной класс для работы с формой
var LoginForm = function () {
    //конструктор получает имя формы и сохраняет её во внутренней переменной
    function LoginForm(formName) {
        _classCallCheck(this, LoginForm);

        this.formCurrent = document.forms[formName];
    }

    //функция возвращает объект с данными формы


    _createClass(LoginForm, [{
        key: "getData",
        value: function getData() {
            //инициализация данных формы
            var formData = {};
            //проверка: "а корректно ли установленно имя формы, может программист ошибься?"
            if (typeof this.formCurrent !== "undefined") {
                //считаем количество элементов в форме
                var countFormElements = this.formCurrent.elements.length;

                //обходим каждый элемент формы
                for (var i = 0; i < countFormElements; i++) {
                    var elementCurrent = this.formCurrent.elements[i];
                    //проверяем тип узла формы, это точно INPUT
                    if (elementCurrent.nodeName.toUpperCase() === 'INPUT') {
                        //сохраняем в данные поля в объект
                        formData[elementCurrent.name] = $.trim(elementCurrent.value);
                    }
                }
            }
            //возвращаем объект
            return formData;
        }

        //процедура принимаем объект и устанавливаем соотвествующим полям формы

    }, {
        key: "setData",
        value: function setData(initData) {
            //список полей для проверки
            var fieldsCheck = ["fio", "email", "phone"];
            //точно задано имя формы корректно?
            if (typeof this.formCurrent === "undefined") {
                return;
            }
            //то что нам передали это объект? а может он пустой?
            if ((typeof initData === "undefined" ? "undefined" : _typeof(initData)) === "object" && !$.isEmptyObject(initData)) {
                var setData = new Set(fieldsCheck);
                //проверяем принятое поле содержится в множестве полей для установки
                for (var keyData in initData) {
                    //а вдруг программист решил унаследовать объект чего-то непонятного, пропускаем поля родителя
                    if (!initData.hasOwnProperty(keyData)) continue;
                    //устанавливаем поля формы в соотвествии с переданным объектом
                    if (setData.has(keyData)) {
                        this.formCurrent.elements[keyData].value = initData[keyData];
                    }
                }
            }
        }

        //процедура для валидации формы

    }, {
        key: "validate",
        value: function validate() {
            var _this = this;

            //имя формы переданно корректно?
            if (typeof this.formCurrent === "undefined") {
                return;
            }

            //показываем сообщение об ошибке, устанавливаем флаг и добавляем в список полей не прошедших валидацию
            var ShowError = function ShowError(container, errorMessage) {
                $("#" + container.id).addClass('error').after("<span class=\"pure-form-message-inline text-error\">" + errorMessage + "</span>");
                isValid = false;
                errorFields.push(container.name);
            };

            //сбрасываем прошлые ошибки
            var resetError = function resetError() {
                var idForm = $("#" + _this.formCurrent.id);
                //удаляем все сообщения об ошибках
                idForm.find(".text-error ").remove();
                //удаляем обвоку вокруг полей формы
                idForm.find(".error").removeClass("error");
            };

            //проверяем ФИО
            var fioCheck = function fioCheck() {
                var fio = _this.formCurrent.elements.fio;
                //может ФИО пустое?
                if (!fio.value) {
                    ShowError(fio, 'Это поле должно быть заполенно!');
                    return;
                }
                //может ФИО содержит не 3 слова?
                if ($.trim(fio.value).split(" ").length !== 3) {
                    ShowError(fio, 'ФИО должно быть ровно 3 слова!');
                    return;
                }
                //Может ФИО не на русском?
                //простая регулярка
                var alphaRegex = /^[А-яёЁ ]+$/i;
                if (!alphaRegex.test(fio.value)) {
                    ShowError(fio, 'В ФИО допускаются только русские буквы!');
                }
            };

            //проверяем email
            var emailCheck = function emailCheck() {
                var email = _this.formCurrent.elements.email;
                //email не пустой?
                if (!email.value) {
                    ShowError(email, 'Это поле должно быть заполенно!');
                    return;
                }
                //email точно из домена Яндекса?
                //интересная регулярка
                var emailRegex = /^([\w\._]+)@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/i;
                if (!emailRegex.test(email.value)) {
                    ShowError(email, 'Email должен быть из домена Яндекса!');
                }
            };

            //проверяем телефонный номер
            var phoneCheck = function phoneCheck() {
                //максимальная сумма цифр в номере телефона
                var maxSum = 30;

                var phone = _this.formCurrent.elements.phone;
                //телефон не пустой?
                if (!phone.value) {
                    ShowError(phone, 'Это поле должно быть заполенно!');
                    return;
                }
                //телефон точно попадает под нужную маску?
                //занимательная регулярка
                var phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;
                if (!phoneRegex.test(phone.value)) {
                    ShowError(phone, 'Формат телефона +7(XXX)XXX-XX-XX!');
                    return;
                }
                //хитрая строчка - сначала убираем все символы, кроме цифр, над получившийся массивом литералов,
                // проводим свёрстку для суммирования, при чём преобразуем знак в цифру при помощи +current
                var resultSum = phone.value.match(/\d/g).reduce(function (sum, current) {
                    return sum + +current;
                }, 0);
                //сумма цифр меньше константы?
                if (resultSum > maxSum) {
                    ShowError(phone, "\u0421\u0443\u043C\u043C\u0430 \u0446\u0438\u0444\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0435\u0442 " + maxSum);
                }
            };

            var isValid = true;
            var errorFields = [];

            resetError();

            fioCheck();
            emailCheck();
            phoneCheck();

            //возвращаем объект
            return { isValid: isValid, errorFields: errorFields };
        }

        //процедура отправки данных формы по ajax

    }, {
        key: "submit",
        value: function submit() {
            var _this2 = this;

            //показываем сообщение о результатах отправки
            var showMessage = function showMessage(typeMessage, textMessage) {
                //хитрая строчка
                //у контейнера удаляем все классы, добавляем новые и нужным типом (ошибка, успешно, прогресс)
                //постепенно показываем сообщение, задержка 2 секунды, постепенно гасим сообщение
                //вот люблю Javascript за такие "паровозы" :-)
                $('#resultContainer').removeClass().addClass('alert alert-' + typeMessage).text(textMessage).fadeIn(1000).delay(2000).fadeOut(1000);
            };

            //процедура установки значений класса и сообщения для отображения
            var switchMessage = function switchMessage(data) {
                var statusMsg = '';
                var dataStatus = '';

                switch (data.status) {
                    case "success":
                        dataStatus = "success";
                        statusMsg = "Success. Данные успешно отправлены!";
                        break;
                    case "error":
                        dataStatus = "error";
                        statusMsg = data.reason;
                        break;
                    case "progress":
                        dataStatus = "progress";
                        statusMsg = "\u0414\u0430\u043D\u043D\u044B\u0435 \u043E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F. \u041F\u043E\u0432\u0442\u043E\u0440 \u0447\u0435\u0440\u0435\u0437 " + data.timeout + " \u0441\u0435\u043A\u0443\u043D\u0434!";
                        break;
                    default:
                        dataStatus = "error";
                        statusMsg = 'Ошибка структуры данных! Обратитесь к системному администратору!';
                        break;

                }
                showMessage(dataStatus, statusMsg);
            };

            //отправка данных формы через ajax
            var getService = function getService(count) {
                //список файлов ответов
                var jsonFilename = ["error.json", "progress.json", "success.json"];
                var idForm = $("#" + _this2.formCurrent.id);
                //url ответа выбираем случайно
                var actionUrl = idForm.attr('action') + jsonFilename[Math.floor(Math.random() * jsonFilename.length)];

                //любимый ajax
                return $.ajax({
                    url: actionUrl,
                    type: 'get',
                    dataType: 'json',
                    //данные формы сериализуем для отправки
                    data: idForm.serialize()
                })
                //ajax завершился хорошо
                .done(function (data) {
                    //пишем сообщение
                    switchMessage(data);
                    //а может данные ещё не обработаны?
                    //сюрприз! если статус = прогресс, процесс повторяет сам себя по интервалу, т.е. рекурсия, хорошо,
                    // что без множественного ветвления
                    if (data.status === "progress") {
                        //в ТЗ четко не указано количество попыток запросов к серверу
                        //а написано, "логика должна повторяться, пока в ответе не вернется отличный от progress статус"
                        //а не вернёться другой статус? Бесконечная рекурсия?
                        //за это, того кто писал ТЗ, надо бить железной линейкой по пальцам. :-)
                        //вообщем рекурсия не более maxCount раз
                        if (++count <= maxCount) {
                            //запускаем новый цикл рекурсии по таймаута, который пришёл с сервера
                            setTimeout(function () {
                                return getService(count);
                            }, parseInt(data.timeout) * 1000);
                        }
                    } else {
                        //включаем отключенную кнопку
                        $("#submitButton").removeClass('pure-button-disabled');
                    }
                })
                //ajax завершился плохо
                .fail(function () {
                    showMessage("error", "Ошибка получения данных!");
                    $("#submitButton").removeClass('pure-button-disabled');
                });
            };

            //форма определена?
            if (typeof this.formCurrent === "undefined") {
                return;
            }

            //количество попыток получить данные с сервера, ограничение рекурсии
            var maxCount = 7;
            //начальное количество попыток получения данных с сервера
            var count = 1;

            //проводим валидацию
            var resultValidate = this.validate();
            //валидация прошла хорошо?
            if (resultValidate.isValid) {
                //отключаем кнопку отправки
                $("#submitButton").addClass('pure-button-disabled');
                //начинаем рекурсию
                getService(count);
            }
        }
    }]);

    return LoginForm;
}();

$(function () {
    //прячем контейнер с сообщаниями
    $('#resultContainer').hide();

    //создаем объект нужного класса и делаем его глобальным
    window.MyForm = new LoginForm("myForm");
    console.log(MyForm.getData());

    //устанавливаем объект с новыми данными
    var initObj = {
        fio: 'Петров Иван Васильевич',
        email: 'petr@ya.ru',
        phone: '+7(111)222-33-11',
        qwe: '111'
    };
    MyForm.setData(initObj);
    console.log(MyForm.getData());

    //обработка нажатия на кнопку
    $('#submitButton').click(function (e) {
        //отмена действия по умолчанию
        e.preventDefault();
        MyForm.submit();
    });
});