//Основной класс для работы с формой
class LoginForm {
    //конструктор получает имя формы и сохраняет её во внутренней переменной
    constructor(formName) {
        this.formCurrent = document.forms[formName];
    }

    //функция возвращает объект с данными формы
    getData() {
        //инициализация данных формы
        let formData = {};
        //проверка: "а корректно ли установленно имя формы, может программист ошибься?"
        if (typeof this.formCurrent !== "undefined") {
            //считаем количество элементов в форме
            const countFormElements = this.formCurrent.elements.length;

            //обходим каждый элемент формы
            for (let i = 0; i < countFormElements; i++) {
                let elementCurrent = this.formCurrent.elements[i];
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
    setData(initData) {
        //список полей для проверки
        const fieldsCheck = ["fio", "email", "phone"];
        //точно задано имя формы корректно?
        if (typeof this.formCurrent === "undefined") {
            return;
        }
        //то что нам передали это объект? а может он пустой?
        if (typeof initData === "object" && !$.isEmptyObject(initData)) {
            let setData = new Set(fieldsCheck);
            //проверяем принятое поле содержится в множестве полей для установки
            for (let keyData in initData) {
                //а вдруг программист решил унаследовать объект чего-то непонятного, пропускаем поля родителя
                if (!initData.hasOwnProperty(keyData))
                    continue;
                //устанавливаем поля формы в соотвествии с переданным объектом
                if (setData.has(keyData)) {
                    this.formCurrent.elements[keyData].value = initData[keyData];
                }
            }
        }
    }

    //процедура для валидации формы
    validate() {
        //имя формы переданно корректно?
        if (typeof this.formCurrent === "undefined") {
            return;
        }

        //показываем сообщение об ошибке, устанавливаем флаг и добавляем в список полей не прошедших валидацию
        let ShowError = (container, errorMessage) => {
            $("#" + container.id).addClass('error').after(`<span class="pure-form-message-inline text-error">${errorMessage}</span>`);
            isValid = false;
            errorFields.push(container.name);
        };

        //сбрасываем прошлые ошибки
        let resetError = () => {
            const idForm = $("#" + this.formCurrent.id);
            //удаляем все сообщения об ошибках
            idForm.find(".text-error ").remove();
            //удаляем обвоку вокруг полей формы
            idForm.find(".error").removeClass("error");
        };

        //проверяем ФИО
        let fioCheck = () => {
            let fio = this.formCurrent.elements.fio;
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
            let alphaRegex = /^[А-яёЁ ]+$/i;
            if (!alphaRegex.test(fio.value)) {
                ShowError(fio, 'В ФИО допускаются только русские буквы!');
            }
        };

        //проверяем email
        let emailCheck = () => {
            let email = this.formCurrent.elements.email;
            //email не пустой?
            if (!email.value) {
                ShowError(email, 'Это поле должно быть заполенно!');
                return;
            }
            //email точно из домена Яндекса?
            //интересная регулярка
            let emailRegex = /^([\w\._]+)@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/i;
            if (!emailRegex.test(email.value)) {
                ShowError(email, 'Email должен быть из домена Яндекса!');
            }
        };

        //проверяем телефонный номер
        let phoneCheck = () => {
            //максимальная сумма цифр в номере телефона
            const maxSum = 30;

            let phone = this.formCurrent.elements.phone;
            //телефон не пустой?
            if (!phone.value) {
                ShowError(phone, 'Это поле должно быть заполенно!');
                return;
            }
            //телефон точно попадает под нужную маску?
            //занимательная регулярка
            let phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/i;
            if (!phoneRegex.test(phone.value)) {
                ShowError(phone, 'Формат телефона +7(XXX)XXX-XX-XX!');
                return;
            }
            //хитрая строчка - сначала убираем все символы, кроме цифр, над получившийся массивом литералов,
            // проводим свёрстку для суммирования, при чём преобразуем знак в цифру при помощи +current
            let resultSum = phone.value.match(/\d/g).reduce((sum, current) => sum + +current, 0);
            //сумма цифр меньше константы?
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

        //возвращаем объект
        return {isValid, errorFields}
    }

    //процедура отправки данных формы по ajax
    submit() {
        //показываем сообщение о результатах отправки
        let showMessage = (typeMessage, textMessage) => {
            //хитрая строчка
            //у контейнера удаляем все классы, добавляем новые и нужным типом (ошибка, успешно, прогресс)
            //постепенно показываем сообщение, задержка 2 секунды, постепенно гасим сообщение
            //вот люблю Javascript за такие "паровозы" :-)
            $('#resultContainer').removeClass().addClass('alert alert-' + typeMessage).text(textMessage).fadeIn(1000).delay(2000).fadeOut(1000);
        };

        //процедура установки значений класса и сообщения для отображения
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

        //отправка данных формы через ajax
        let getService = (count) => {
            //список файлов ответов
            const jsonFilename = ["error.json", "progress.json", "success.json"];
            const idForm = $("#" + this.formCurrent.id);
            //url ответа выбираем случайно
            let actionUrl = idForm.attr('action') + jsonFilename[Math.floor(Math.random() * jsonFilename.length)];

            //любимый ajax
            return $.ajax({
                url: actionUrl,
                type: 'get',
                dataType: 'json',
                //данные формы сериализуем для отправки
                data: idForm.serialize()
            })
                //ajax завершился хорошо
                .done((data) => {
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
                            setTimeout(() => getService(count), parseInt(data.timeout) * 1000);
                        }
                    } else {
                        //включаем отключенную кнопку
                        $("#submitButton").removeClass('pure-button-disabled');
                    }
                })
                //ajax завершился плохо
                .fail(() => {
                    showMessage("error", "Ошибка получения данных!");
                    $("#submitButton").removeClass('pure-button-disabled');
                });
        };

        //форма определена?
        if (typeof this.formCurrent === "undefined") {
            return;
        }

        //количество попыток получить данные с сервера, ограничение рекурсии
        const maxCount = 7;
        //начальное количество попыток получения данных с сервера
        let count = 1;

        //проводим валидацию
        let resultValidate = this.validate();
        //валидация прошла хорошо?
        if (resultValidate.isValid) {
            //отключаем кнопку отправки
            $("#submitButton").addClass('pure-button-disabled');
            //начинаем рекурсию
            getService(count);
        }
    }
}

$(function () {
    //прячем контейнер с сообщаниями
    $('#resultContainer').hide();

    //создаем объект нужного класса и делаем его глобальным
    window.MyForm = new LoginForm("myForm");
    console.log(MyForm.getData());

    //устанавливаем объект с новыми данными
    let initObj = {
        fio: 'Петров Иван Васильевич',
        email: 'petr@ya.ru',
        phone: '+7(111)222-33-11',
        qwe: '111'
    };
    MyForm.setData(initObj);
    console.log(MyForm.getData());

    //обработка нажатия на кнопку
    $('#submitButton').click((e) => {
        //отмена действия по умолчанию
        e.preventDefault();
        MyForm.submit();
    })
});
