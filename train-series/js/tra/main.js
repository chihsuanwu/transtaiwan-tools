
window.onload = async function() {
    const data = await loadData();
    render(data);
}

async function loadData() {
    const data = await fetch("https://api.transtaiwan.com/train_series/tra.json");
    return await data.json();
}
