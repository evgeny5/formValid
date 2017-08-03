class LoginForm {
    constructor(formName) {
        this.formCurrent = document.forms[formName];
    }

    getData() {
        let formData = {};
        if (typeof this.formCurrent !== "undefined") {
            const countFormElements = this.formCurrent.elements.length;

            for (let i = 0; i < countFormElements; i++) {
                let elementCurrent = this.formCurrent.elements[i];
                if (elementCurrent.nodeName.toUpperCase() === 'INPUT') {
                    formData[elementCurrent.name] = $.trim(elementCurrent.value);
                }
            }
        }
        return formData;
    }

    setData(initData) {
        const fieldsCheck = ["fio", "email", "phone"];

        if (typeof this.formCurrent === "undefined") {
            return;
        }

        if (typeof initData === "object" && !$.isEmptyObject(initData)) {
            let setData = new Set(fieldsCheck);
            for (let keyData in initData) {
                if (!initData.hasOwnProperty(keyData))
                    continue;

                if (setData.has(keyData)) {
                    this.formCurrent.elements[keyData].value = initData[keyData];
                }
            }
        }
    }

    validate() {
        if (typeof this.formCurrent === "undefined") {
            return;
        }

        let ShowError = (container, errorMessage) => {
            $("#" + container.id).addClass('error').after(`<span class="pure-form-message-inline text-error">${errorMessage}</span>`);
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
            const maxSum = 30;

            let phone = this.formCurrent.elements.phone;
            if (!phone.value) {
                ShowError(phone, 'Это поле должно быть заполенно!');
                return;
            }

            let phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;
            if (!phoneRegex.test(phone.value)) {
                ShowError(phone, 'Формат телефона +7(XXX)XXX-XX-XX!');
                return;
            }

            let resultSum = phone.value.match(/\d/g).reduce((sum, current) => sum + +current, 0);
            if (resultSum > maxSum) {
                ShowError(phone, `Сумма цифр телефона превышает ${maxSum}`);
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

    submit() {
        let showMessage = (typeMessage, textMessage) => {
            $('#resultContainer').removeClass().addClass('alert alert-' + typeMessage).text(textMessage).fadeIn(1000).delay(2000).fadeOut(1000);
        };

        let switchMessage = (data) => {
            let statusMsg = '';
            let dataStatus = '';

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
                    statusMsg = `Данные обрабатываются. Повтор через ${data.timeout} секунд!`;
                    break;
                default:
                    dataStatus = "error";
                    statusMsg = 'Ошибка структуры данных! Обратитесь к системному администратору!';
                    break;

            }
            showMessage(dataStatus, statusMsg);
        };

        let getService = (count) => {
            const jsonFilename = ["error.json", "progress.json", "success.json"];
            const idForm = $("#" + this.formCurrent.id);
            let actionUrl = idForm.attr('action') + jsonFilename[Math.floor(Math.random() * jsonFilename.length)];

            return $.ajax({
                url: actionUrl,
                type: 'get',
                dataType: 'json',
                data: idForm.serialize()
            })
                .done((data) => {
                    switchMessage(data);
                    if (data.status === "progress") {
                        if (++count <= maxCount) {
                            setTimeout(() => getService(count), parseInt(data.timeout) * 1000);
                        }
                    } else {
                        $("#submitButton").removeClass('pure-button-disabled');
                    }
                })
                .fail(() => {
                    showMessage("error", "Ошибка получения данных!");
                    $("#submitButton").removeClass('pure-button-disabled');
                });
        };

        if (typeof this.formCurrent === "undefined") {
            return;
        }

        let resultValidate = this.validate();
        const maxCount = 7;
        let count = 1;

        if (resultValidate.isValid) {
            $("#submitButton").addClass('pure-button-disabled');
            getService(count);
        }
    }
}

$(function () {
    $('#resultContainer').hide();

    window.MyForm = new LoginForm("myForm");
    // console.log(MyForm.getData());

    let initObj = {
        fio: 'Петров Иван Васильевич',
        email: 'petr@ya.ru',
        phone: '+7(111)222-33-11',
        qwe: '111'
    };
    MyForm.setData(initObj);
    // console.log(MyForm.getData());

    $('#submitButton').click((e) => {
        e.preventDefault();
        MyForm.submit();
    })
});
