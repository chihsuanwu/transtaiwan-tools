
window.onload = async function() {
    const data = await loadData();
    render(data);
}

async function loadData() {
    return await (await fetch(`https://api.transtaiwan.com/train_series/metro.json`)).json();
}