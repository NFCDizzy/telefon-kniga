const searchControl = document.querySelector('.search-control');
const headerInput = document.querySelector('.header-input');
const contactsList = document.querySelector('.contacts-list');
const contactsCompleted = document.querySelector('.contacts-completed');

const openModalBtn = document.querySelector('.open-modal');
const modal = document.querySelector('.modal');
const close = document.querySelector('.modal__close');

const form = document.querySelector('#form');
const nameInput = document.querySelector('#name');
const phoneInput = document.querySelector('#phone');
const checkbox = document.querySelector('#checkbox');

let contactsData = [];

//Тест функция на пустоту localStorage
const test = () => {
    if (localStorage.getItem('contacts')!==null) {
        contactsData = JSON.parse(localStorage.getItem('contacts'));
        render(contactsData);
    }
}

//Функция валидирования
const customTrim = (val) => {
    val = val.replace(/\s+/g, " "); //много пробелов в один
    val = val.replace(/-+/g, '-'); //много дефисов в один
    val = val.replace(/\(+/g, '('); //много скобок в один
    val = val.replace(/\)+/g, ')'); //много скобок в один
    val = val.replace(/^[ |\-+]/g, ''); //удаление дефисов и пробелов в начале
    val = val.replace(/[ |\-+]$/g, ''); //удаление дефисов и пробелов в конце
    return val;
}
//Добавление в localStorage
const addToStorage = (arr) => {
    localStorage.clear();
    localStorage.setItem('contacts', JSON.stringify(arr));
};

//Удаление контакта
const deleteComm = (arr) => {
    arr.forEach((item, index) => {
        if (item.delete == true) {
            contactsData.forEach((elem, i) => {
                if (elem.name == item.name) {
                    contactsData.splice(i, 1);
                }
            })
        }
    })
    for (let i = arr.length - 1; i >= 0; --i) {
        if (arr[i].delete == true) {
            arr.splice(i,1);
        }
    }
    addToStorage(arr);
    render(arr);
}

//Рендер списка контактов
const render = (arr) => {
    contactsList.innerHTML = '';
    contactsCompleted.innerHTML = '';
    arr.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    arr.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('contacts-item');
        li.innerHTML = `
                <div class="contacts-info">
					<div class="contacts-avatar"></div>
					<div class="contacts-desc">
						<span class="text-contacts">${item.name}</span>
						<span class="text-contacts">${item.phone}</span>
					</div>
				</div>
				<div class="contacts-buttons">
					<button class="contacts-remove"></button>
					<button class="contacts-complete"></button>
				</div>
        `
        if (item.completed) {
            contactsCompleted.append(li);

        } else if (!item.completed) {
            contactsList.append(li);
        }

        li.querySelector('.contacts-complete').addEventListener('click', () => {
            item.completed = !item.completed;
            render(arr);
            addToStorage(arr);
        });
        li.querySelector('.contacts-remove').addEventListener('click', () => {
            item.delete = !item.delete;
            //удаление элемента
            deleteComm(arr);
            render(arr);
        });
    }); 
};

//Поиск контактов
const search = () => {
    headerInput.addEventListener('input', (e) => {
        if (contactsData.length !== 0) {
            let newList = [];
            contactsData.filter(function (e) {
                return e.name.toLowerCase().includes(headerInput.value.toLowerCase())
            })
            .forEach(item => {
                newList.push(item);
            })
            render(newList);
        }
    })
}

//Поиск контактов по кнопке поиск
searchControl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (headerInput.value !== '') {
        if (contactsData.length !== 0) {
            let newList = [];
            contactsData.filter(function (e) {
                return e.name.toLowerCase().includes(headerInput.value.toLowerCase())
            })
            .forEach(item => {
                newList.push(item);
            })
            render(newList);
        }
    }
})

//Валидация поля Имени на русский язык
nameInput.addEventListener('blur', (e) => {
    let val = e.target.value;
    val = val.replace(/[^а-яё \-]$/ig, '');
    val = customTrim(val);
    val = val.replace(/( |^)[ а-яё]/g, u => u.toUpperCase());
    e.target.value = val;
});
nameInput.addEventListener('input', () => {
    nameInput.value = nameInput.value.replace(/[^а-яё \-}]$/ig, '');
});

//Валидация поля Поиска на русский язык
headerInput.addEventListener('input', () => {
    headerInput.value = headerInput.value.replace(/[^а-яё \-}]$/ig, '');
});

//Добавление нового контакта
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newContact = {
        name: nameInput.value,
        phone: phoneInput.value,
        completed: checkbox.checked,
        delete: false
    };
    contactsData.push(newContact);
    nameInput.value = '';
    phoneInput.value = '';
    checkbox.checked = false;
    if (modal.classList.contains('modal_active')) {
        modal.classList.remove('modal_active');
    }

    render(contactsData);
    addToStorage(contactsData);
});

//Открытие модального окна
openModalBtn.addEventListener('click', () => {
    modal.classList.add('modal_active');
})
close.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.toggle('modal_active');
});

//Маска на номер телефона
let im = new Inputmask({
    mask: '(+7|8) (999) 999-99-99',
    showMaskOnHover: false,
    showMaskOnFocus: false,
    jitMasking: true,
    inputmode: 'tel'
});
im.mask(phoneInput);

search();
test();