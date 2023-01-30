
function render(data) {
    for (const key in data) {
        const value = data[key];
        renderData(key, value);
    }
}

function renderData(company, data) {
    const parent = document.querySelector('#data');
    parent.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('data-table');

    const title = document.createElement('h2');
    title.textContent = COMPANY[company];
    parent.appendChild(title);

    // Add table header
    const header = document.createElement('tr');
    const carNo = document.createElement('th');
    carNo.classList.add('car-no');
    carNo.textContent = '列車編組';
    const type = document.createElement('th');
    type.classList.add('type');
    type.textContent = '類別';
    const fullName = document.createElement('th');
    fullName.classList.add('full-name');
    fullName.textContent = '全名';

    header.appendChild(carNo);
    header.appendChild(type);
    header.appendChild(fullName);

    table.appendChild(header);

    // Add table body
    const body = document.createElement('tbody');
    for (item of data) {
        const row = document.createElement('tr');
        const carNo = document.createElement('td');
        carNo.classList.add('car-no');
        carNo.textContent = item['CarNo'];
        const disaplyName = document.createElement('td');
        disaplyName.classList.add('display-name');
        disaplyName.textContent = item['Name'];
        const fullName = document.createElement('td');
        fullName.classList.add('full-name');
        fullName.textContent = item['Note'];

        row.appendChild(carNo);
        row.appendChild(disaplyName);
        row.appendChild(fullName);

        body.appendChild(row);
    }

    table.appendChild(body);

    parent.appendChild(table);
}

const COMPANY = {
    'TRTC': '北捷',
    'KRTC': '高捷',
    'TYMC': '桃捷',
    'KLRT': '高雄輕軌',
    'NTDLRT': '新北輕軌',
}