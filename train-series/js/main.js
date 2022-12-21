
let DATA_SOURCE = "REMOTE"; // "LOCAL" or "REMOTE"
const MODE = "DEPLOY"; // "TEST" or "DEPLOY"

window.onload = async function() {
    const data = await loadData();
    render(data);
}


document.querySelector("#data-source-selector-server").addEventListener("change", async function() {
    DATA_SOURCE = "REMOTE"
    const data = await loadData();
    render(data);
});

document.querySelector("#data-source-selector-local").addEventListener("change", async function() {
    DATA_SOURCE = "LOCAL"
    const data = await loadData();
    render(data);
});