class LoginForm {
    constructor(formName) {
        this.formData = {};
        this.formCurrent = document.forms[formName];

        if (typeof this.formCurrent !== "undefined") {
            const countFormElements = this.formCurrent.elements.length;

            for (let i = 0; i < countFormElements; i++) {
                let elementCurrent = this.formCurrent.elements[i];
                if (elementCurrent.nodeName.toUpperCase() === 'INPUT') {
                    this.formData[elementCurrent.name] = elementCurrent.value;
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
                    this.formData[keyData] = initData[keyData];
                }

            }
        }
    }

    
}

$(function () {
    window.MyForm = new LoginForm("form-valid");
    console.log(MyForm.getData());

    let initObj = {
        fio: 'Петров Иван Васильевич',
        email: 'petr@ya.ru',
        phone: '+7(912)952-15-96',
        qwe: '111'
    };
    MyForm.setData(initObj);
    console.log(MyForm.getData());
});
