"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginForm = function () {
    function LoginForm(formName) {
        _classCallCheck(this, LoginForm);

        this.formCurrent = document.forms[formName];
    }

    _createClass(LoginForm, [{
        key: "getData",
        value: function getData() {
            var formData = {};
            if (typeof this.formCurrent !== "undefined") {
                var countFormElements = this.formCurrent.elements.length;

                for (var i = 0; i < countFormElements; i++) {
                    var elementCurrent = this.formCurrent.elements[i];
                    if (elementCurrent.nodeName.toUpperCase() === 'INPUT') {
                        formData[elementCurrent.name] = $.trim(elementCurrent.value);
                    }
                }
            }
            return formData;
        }
    }, {
        key: "setData",
        value: function setData(initData) {
            var fieldsCheck = ["fio", "email", "phone"];

            if (typeof this.formCurrent === "undefined") {
                return;
            }

            if ((typeof initData === "undefined" ? "undefined" : _typeof(initData)) === "object" && !$.isEmptyObject(initData)) {
                var setData = new Set(fieldsCheck);
                for (var keyData in initData) {
                    if (!initData.hasOwnProperty(keyData)) continue;

                    if (setData.has(keyData)) {
                        this.formCurrent.elements[keyData].value = initData[keyData];
                    }
                }
            }
        }
    }, {
        key: "validate",
        value: function validate() {
            var _this = this;

            if (typeof this.formCurrent === "undefined") {
                return;
            }

            var ShowError = function ShowError(container, errorMessage) {
                $("#" + container.id).addClass('error').after("<span class=\"pure-form-message-inline text-error\">" + errorMessage + "</span>");
                isValid = false;
                errorFields.push(container.name);
            };

            var resetError = function resetError() {
                var idForm = "#" + _this.formCurrent.id;
                $(idForm).find(".text-error ").remove();
                $(idForm).find(".error").removeClass("error");
            };

            var fioCheck = function fioCheck() {
                var fio = _this.formCurrent.elements.fio;
                if (!fio.value) {
                    ShowError(fio, 'Это поле должно быть заполенно!');
                    return;
                }

                if ($.trim(fio.value).split(" ").length !== 3) {
                    ShowError(fio, 'ФИО должно быть ровно 3 слова!');
                    return;
                }

                var alphaRegex = /^[А-яёЁ ]+$/i;
                if (!alphaRegex.test(fio.value)) {
                    ShowError(fio, 'В ФИО допускаются только русские буквы!');
                }
            };

            var emailCheck = function emailCheck() {
                var email = _this.formCurrent.elements.email;
                if (!email.value) {
                    ShowError(email, 'Это поле должно быть заполенно!');
                    return;
                }
                var emailRegex = /^([\w\._]+)@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/i;
                if (!emailRegex.test(email.value)) {
                    ShowError(email, 'Email должен быть из домена Яндекса!');
                }
            };

            var phoneCheck = function phoneCheck() {
                var maxSum = 30;

                var phone = _this.formCurrent.elements.phone;
                if (!phone.value) {
                    ShowError(phone, 'Это поле должно быть заполенно!');
                    return;
                }

                var phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;
                if (!phoneRegex.test(phone.value)) {
                    ShowError(phone, 'Формат телефона +7(XXX)XXX-XX-XX!');
                    return;
                }

                var resultSum = phone.value.match(/\d/g).reduce(function (sum, current) {
                    return sum + +current;
                }, 0);
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

            return { isValid: isValid, errorFields: errorFields };
        }
    }, {
        key: "submit",
        value: function submit() {
            var _this2 = this;

            var showMessage = function showMessage(typeMessage, textMessage) {
                $('#resultContainer').removeClass().addClass('alert alert-' + typeMessage).text(textMessage).fadeIn(1000).delay(2000).fadeOut(1000);
            };

            var switchMessage = function switchMessage(data) {
                var statusMsg = '';
                var dataStatus = '';

                switch (data.status) {
                    case "success":
                        dataStatus = "success";
                        statusMsg = "Данные успешно отправлены!";
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

            var getService = function getService(count) {
                var jsonFilename = ["error.json", "progress.json", "success.json"];
                var idForm = $("#" + _this2.formCurrent.id);
                var actionUrl = idForm.attr('action') + jsonFilename[Math.floor(Math.random() * jsonFilename.length)];

                return $.ajax({
                    url: actionUrl,
                    type: 'get',
                    dataType: 'json',
                    data: idForm.serialize()
                }).done(function (data) {
                    switchMessage(data);
                    if (data.status === "progress") {
                        if (++count <= maxCount) {
                            setTimeout(function () {
                                return getService(count);
                            }, parseInt(data.timeout) * 1000);
                        }
                    }
                }).fail(function () {
                    return showMessage("error", "Ошибка получения данных!");
                });
            };

            if (typeof this.formCurrent === "undefined") {
                return;
            }

            var resultValidate = this.validate();
            var maxCount = 7;
            var count = 1;

            if (resultValidate.isValid) {
                getService(count);
            }
        }
    }]);

    return LoginForm;
}();

$(function () {
    $('#resultContainer').hide();

    window.MyForm = new LoginForm("form-valid");
    // console.log(MyForm.getData());

    var initObj = {
        fio: 'Петров Иван Васильевич',
        email: 'petr@ya.ru',
        phone: '+7(111)222-33-11',
        qwe: '111'
    };
    MyForm.setData(initObj);
    // console.log(MyForm.getData());

    $('#submitButton').click(function (e) {
        e.preventDefault();
        MyForm.submit();
    });
});