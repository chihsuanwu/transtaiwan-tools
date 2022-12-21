
function render(data) {
    const specified = data['specified'];
    const other = data['other'];

    renderSpecified(specified);
    renderOther(other);
}

function renderSpecified(specified) {
    document.querySelector('#select-wrapper').innerHTML = '';

    // create selector for specified from - to
    const selector = document.createElement('select');
    selector.classList.add('specified-selector');
    for (const data of specified) {
        const from = data['from'];
        const to = data['to'];
        const option = document.createElement('option');
        let text = ""
        if (from == null) {
            text = `${to}以前`;
        } else if (to == null) {
            text = `${from}以後`;
        } else {
            text = `${from} - ${to}`;
        }
        option.value = text;
        option.textContent = text;
        selector.appendChild(option);
    }
    selector.addEventListener('change', function() {
        const index = this.selectedIndex;
        const data = specified[index];
        renderSpecifiedData(data);
    });
    document.querySelector('#select-wrapper').appendChild(selector);

    // render first specified data
    const firstData = specified[0];
    renderSpecifiedData(firstData);
}

function renderSpecifiedData(data) {
    const parent = document.querySelector('#specified');
    parent.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('specified-table');


    // Add table header
    const header = document.createElement('tr');
    const series = document.createElement('th');
    series.classList.add('series');
    series.textContent = '車型';
    const no = document.createElement('th');
    no.classList.add('no');
    no.textContent = '車次';

    header.appendChild(series);
    header.appendChild(no);
    table.appendChild(header);

    for (const series of data['series']) {
        table.appendChild(createSeriesElement(series));
    }

    parent.appendChild(table);
}

function createSeriesElement(seriesList) {
    const trainElement = document.createElement('tr');
    trainElement.classList.add('train');

    const series = document.createElement('td');
    series.classList.add('series');
    series.textContent = seriesList['name'];

    const train = document.createElement('td');
    train.classList.add('no');
    train.textContent = createTrainText(seriesList['train']);

    trainElement.appendChild(series);
    trainElement.appendChild(train);

    return trainElement;
}

function createTrainText(trainList) {
    return trainList.map((train) => {
        let text = train['no'];
        if (train['except'] != null) {
            text += " (" + train['except'].map((except) => weekday[except]).join('，') + "以外) ";
        }
        if (train['only'] != null) {
            text += " (" + train['only'].map((only) => weekday[only]).join('，') + ") ";
        }
        return text;
    }).join('，');
}


function renderOther(other) {
    const parent = document.querySelector('#other');
    parent.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = '其他未列出車次';
    parent.appendChild(title);

    for (const position of other) {
        createPositionElement(position, parent);
    }
}

function createPositionElement(position, parent) {
    const positionElement = document.createElement('div');
    positionElement.classList.add('position');

    const positionName = document.createElement('h3');
    positionName.textContent = position['name'];
    positionElement.appendChild(positionName);

    const table = document.createElement('table');
    table.classList.add('other-table');

    const header = document.createElement('tr');
    const no = document.createElement('th');
    no.textContent = '車次';
    const series = document.createElement('th');
    series.textContent = '車型';
    const regex = document.createElement('th');
    regex.textContent = 'REGEX';
    header.appendChild(no);
    header.appendChild(series);
    header.appendChild(regex);
    table.appendChild(header);

    for (const train of position['train']) {
        table.appendChild(createOtherTrainElement(train));
    }

    positionElement.appendChild(table);
    parent.appendChild(positionElement);
}

function createOtherTrainElement(train) {
    const trainElement = document.createElement('tr');
    trainElement.classList.add('train');

    const readable = document.createElement('td');
    readable.textContent = train['readable'];

    const trainSeries = document.createElement('td');
    trainSeries.textContent = train['series'];

    const regex = document.createElement('td');
    regex.textContent = train['regex'];

    trainElement.appendChild(readable);
    trainElement.appendChild(trainSeries);
    trainElement.appendChild(regex);

    return trainElement;
}


weekday = {
    'MON': '週一',
    'TUE': '週二',
    'WED': '週三',
    'THU': '週四',
    'FRI': '週五',
    'SAT': '週六',
    'SUN': '週日',
}