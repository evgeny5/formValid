class LoginForm {
    constructor(formName) {
        this.formData = {};
        this.formCurrent = document.forms[formName];

        if (typeof this.formCurrent !== "undefined") {
            const countFormElements = this.formCurrent.elements.length;

            for (let i = 0; i < countFormElements; i++) {
                let elementCurrent = this.formCurrent.elements[i];
                if (elementCurrent.nodeName.toUpperCase() === 'INPUT') {
                    this.formData[elementCurrent.name] = $.trim(elementCurrent.value);
                }
            }
        }
    }

    getData() {
        return this.formData;
    }

    setData(initData) {
        if (typeof initData === "object" && !$.isEmptyObject(initData)) {
            let setData = new Set(["fio", "email", "phone"]);
            for (let keyData in initData) {
                if (!initData.hasOwnProperty(keyData))
                    continue;

                if (setData.has(keyData)) {
                    this.formCurrent.elements[keyData].value = initData[keyData];
                    this.formData[keyData] = $.trim(initData[keyData]);
                }

            }
        }
    }

    validate() {
        let ShowError = (container, errorMessage) => {
            const id = "#" + container.id;
            $(id).addClass('error');
            $(id).after(`<span class="pure-form-message-inline text-error">${errorMessage}</span>`);
            isValid = false;
            errorFields.push(container.name);
        };

        let resetError = () => {
            const idForm = "#" + this.formCurrent.id;
            $(idForm).find(".text-error ").remove();
            $(idForm).find(".error").removeClass("error");
        };

        let fioCheck = () => {
            let fio = this.formCurrent.elements.fio;
            if (!fio.value) {
                ShowError(fio, 'Это поле должно быть заполенно!');
                return;
            }

            if ($.trim(fio.value).split(" ").length !== 3) {
                ShowError(fio, 'ФИО должно быть ровно 3 слова!');
                return;
            }

            let alphaRegex = /^[А-яёЁ ]+$/i;
            if (!alphaRegex.test(fio.value)) {
                ShowError(fio, 'В ФИО допускаются только русские буквы!');
            }
        };

        let emailCheck = () => {
            let email = this.formCurrent.elements.email;
            if (!email.value) {
                ShowError(email, 'Это поле должно быть заполенно!');
                return;
            }
            let emailRegex = /^([\w\._]+)@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/i;
            if (!emailRegex.test(email.value)) {
                ShowError(email, 'Email должен быть из домена Яндекса!');
            }
        };

        let phoneCheck = () => {
            let phone = this.formCurrent.elements.phone;
            if (!phone.value) {
                ShowError(phone, 'Это поле должно быть заполенно!');
                return;
            }

            let phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;
            if (!phoneRegex.test(phone.value)) {
                ShowError(phone, 'Формат телефона +7(XXX)XXX-XX-XX!');
            }
        };

        let isValid = true;
        let errorFields = [];

        resetError();
        fioCheck();
        emailCheck();
        phoneCheck();

        return {isValid, errorFields}
    }

}

$(function () {
    window.MyForm = new LoginForm("form-valid");
    // console.log(MyForm.getData());

    let initObj = {
        fio: 'Петров Иван Васильевич',
        email: 'petr@ya.ru',
        phone: '+7(912)952-15-96',
        qwe: '111'
    };
    MyForm.setData(initObj);
    // console.log(MyForm.getData());

    $('#submitButton').click((e) => {
        e.preventDefault();
        console.log(MyForm.validate());
    })
});
