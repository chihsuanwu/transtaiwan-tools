const MODE = 'LOCAL';

const DRAW = "ZH";
// const DRAW = "EN";
// const DRAW = "JA";

let company = 'trtc';

window.onload = async () => {
    document.querySelector(`#btn-${company}`).classList.add('selected');
    load();
}

document.querySelector("#btn-trtc").addEventListener('click', (e) => {
    if (company != 'trtc') {
        company = 'trtc';
        document.querySelector("#btn-trtc").classList.add('selected');
        document.querySelector("#btn-krtc").classList.remove('selected');
        load();
    }
})

document.querySelector("#btn-krtc").addEventListener('click', (e) => {
    if (company != 'krtc') {
        company = 'krtc';
        document.querySelector("#btn-krtc").classList.add('selected');
        document.querySelector("#btn-trtc").classList.remove('selected');
        load();
    }
})
