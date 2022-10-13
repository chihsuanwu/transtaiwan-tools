async function loadData(company, line) {
    let lineData = await loadLine(company, line);
    let speedData = await loadSpeed(company, line);
    let stationData = await loadStation(company, line);
  
    shapeData.init(lineData, speedData, stationData);
}
  
async function loadLine(company, lineName) {
    let path = `data/${company}/line.json`;
    const result = await fetch(path);
    const jsonData = await result.json();
    return jsonData.find((e) => e["name"] == lineName);
}
  
async function loadSpeed(company, lineName) {
    let path = `data/${company}/speed.json`;
    const result = await fetch(path);
    const jsonData = await result.json();
    return jsonData.find((e) => e["name"] == lineName);
}
  
async function loadStation(company, lineName) {
    let path = `data/${company}/station.json`;
    const result = await fetch(path);
    const jsonData = await result.json();
    return jsonData.filter((e) => e["line"].includes(lineName));
}

function download() {
    downloadJson(shapeData.line, "line.json");
    downloadJson(shapeData.speed, "speed.json");
    downloadJson(shapeData.station, "station.json");
}

function downloadJson(json, fileName) {
    let content = JSON.stringify(json);
    let bb = new Blob([ content ], { type: 'text/plain' });
    let a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(bb);
    a.click();
}
