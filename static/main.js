// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap';
script.async = true;

// Append the 'script' element to 'head'
document.head.appendChild(script);


let mapType = "Speed";

let map;

let shapeData = new ShapeData();

let mapItems = [];

let selectedCompany = "THSR";

window.onload = async function() {
    await loadData("thsr", "main");
    drawAll();
}

async function selectChange() {
    selectValue = document.querySelector("#select-line").value;
    console.log(selectValue);

    if (selectValue == "THSR") {
        selectedCompany = "THSR";
        await loadData("thsr", "main");
    } else if (selectValue.startsWith('TRTC')) {
        selectedCompany = "TRTC";
        await loadData("trtc", selectValue.slice(5));
    } else if (selectValue.startsWith('KRTC')) {
        selectedCompany = "KRTC";
        await loadData("krtc", selectValue.slice(5));
    } else if (selectValue.startsWith('TYMC')) {
        selectedCompany = "TYMC";
        await loadData("tymc", selectValue.slice(5));
    } else if (selectValue.startsWith('TMRT')) {
        selectedCompany = "TMRT";
        await loadData("tmrt", selectValue.slice(5));
    } else if (selectValue.startsWith('KLRT')) {
        selectedCompany = "KLRT";
        await loadData("klrt", selectValue.slice(5));
    } else if (selectValue.startsWith('NTDLRT')) {
        selectedCompany = "NTDLRT";
        await loadData("ntdlrt", selectValue.slice(7));
    } else {
        selectedCompany = "TRA";
        await loadData("tra", selectValue);
    }

    drawAll();
}

async function mapTypeChange() {
    selectValue = document.querySelector("#select-type").value;
    console.log(selectValue);
  
    mapType = selectValue;
    drawAll();
}

// Attach your callback function to the `window` object
window.initMap = function() {
    // JS API is loaded and available
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 23.6, lng: 121.0},
        zoom: 9,
    });

    map.addListener("click", function() {
        onMapClickSpeed();
        onMapClickShape();
        document.querySelector("#info_wrapper_inner").innerHTML = "";
    });
};


function drawAll() {
    // Remove all map items on map.
    for (let i of mapItems) {
        i.setMap(null);
    }
    mapItems = [];

    switch (mapType) {
        case "Speed":
            drawSpeedData();
            break;
        case "Shape":
            drawShapeData();
            break;
    }
}
