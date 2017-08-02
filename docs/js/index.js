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
                    this.formData[elementCurrent.name] = elementCurrent.value;
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
                        this.formData[keyData] = initData[keyData];
                    }
                }
            }
        }
    }]);

    return LoginForm;
}();

$(function () {
    window.MyForm = new LoginForm("form-valid");
    console.log(MyForm.getData());

    var initObj = {
        fio: 'Петров Иван Васильевич',
        email: 'petr@ya.ru',
        phone: '+7(912)952-15-96',
        qwe: '111'
    };
    MyForm.setData(initObj);
    console.log(MyForm.getData());
});