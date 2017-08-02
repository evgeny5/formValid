"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginForm = function () {
    function LoginForm(formName) {
        _classCallCheck(this, LoginForm);

        this.formData = {};
        this.formCurrent = document.forms[formName];

        if (typeof this.formCurrent !== "undefined") {
            var countFormElements = this.formCurrent.elements.length;

            for (var i = 0; i < countFormElements; i++) {
                var elementCurrent = this.formCurrent.elements[i];
                if (elementCurrent.nodeName.toUpperCase() === 'INPUT') {
                    this.formData[elementCurrent.name] = $.trim(elementCurrent.value);
                }
            }
        }
    }

    _createClass(LoginForm, [{
        key: "getData",
        value: function getData() {
            return this.formData;
        }
    }, {
        key: "setData",
        value: function setData(initData) {
            if ((typeof initData === "undefined" ? "undefined" : _typeof(initData)) === "object" && !$.isEmptyObject(initData)) {
                var setData = new Set(["fio", "email", "phone"]);
                for (var keyData in initData) {
                    if (!initData.hasOwnProperty(keyData)) continue;

                    if (setData.has(keyData)) {
                        this.formCurrent.elements[keyData].value = initData[keyData];
                        this.formData[keyData] = $.trim(initData[keyData]);
                    }
                }
            }
        }
    }, {
        key: "validate",
        value: function validate() {
            var _this = this;

            var ShowError = function ShowError(container, errorMessage) {
                var id = "#" + container.id;
                $(id).addClass('error');
                $(id).after("<span class=\"pure-form-message-inline text-error\">" + errorMessage + "</span>");
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
                var phone = _this.formCurrent.elements.phone;
                if (!phone.value) {
                    ShowError(phone, 'Это поле должно быть заполенно!');
                    return;
                }

                var phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;
                if (!phoneRegex.test(phone.value)) {
                    ShowError(phone, 'Формат телефона +7(XXX)XXX-XX-XX!');
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
    }]);

    return LoginForm;
}();

$(function () {
    window.MyForm = new LoginForm("form-valid");
    // console.log(MyForm.getData());

    var initObj = {
        fio: 'Петров Иван Васильевич',
        email: 'petr@ya.ru',
        phone: '+7(912)952-15-96',
        qwe: '111'
    };
    MyForm.setData(initObj);
    // console.log(MyForm.getData());

    $('#submitButton').click(function (e) {
        e.preventDefault();
        console.log(MyForm.validate());
    });
});