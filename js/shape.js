let clickedPoint = [];

function onMapClickShape() {
    clearClickPoint();
}

function clearClickPoint() {
    if (clickedPoint.length != 0) {
        for (let point of clickedPoint) {
            point.setMap(null);
        }
    }
    clickedPoint = [];
}

function drawShapeData() {
    const addMenu = createAddMenu();
  
    const line = shapeData.getLineList();

    const path = new google.maps.Polyline({
        path: line,
        strokeColor: "#2f5597",
        strokeOpacity: 1,
        strokeWeight: 6,
        map: map,
    });

    mapItems.push(path);

    google.maps.event.addListener(path, 'click', function(e) { 
        const closestPoint = closestPointOnPath(e.latLng, path);
        console.log(closestPoint)
        showClickedPoint(closestPoint.latLng);
    });
}

function showClickedPoint(point) {
    const deleteMenu = createDeleteMenu();

    // if (clickedPoint != null) {
    //     clickedPoint.setMap(null);
    // }

    const svgMarker = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 1.5,
        strokeColor: "#000000",
        strokeOpacity: 0.6,
        rotation: 0,
        scale: 7,
    };

    const marker = new google.maps.Marker({
        position: point,
        icon: svgMarker,
        map: map,
        draggable: true,
    });

    clickedPoint.push(marker);

    google.maps.event.addListener(marker, 'dragend', function(e) {
        const origin = [point.lat(), point.lng()];
        const newPoint = [Number(e.latLng.lat().toFixed(5)), Number(e.latLng.lng().toFixed(5))];
        shapeData.changeShapePoint(origin, newPoint);
        clearClickPoint();
        drawAll();
    });

    // Delete Menu
    google.maps.event.addListener(marker, "contextmenu", function(e) {
        deleteMenu.open(map, e.latLng, () => {
            const origin = [point.lat(), point.lng()];
            shapeData.deleteShapePoint(origin);
            clearClickPoint();
            drawAll();
        });
    });

    updateInfo();
}

function updateInfo() {

    let htmlString = "<div>";
    for (let point of clickedPoint) {
        htmlString += `Position: (${point.position.lat()}, ${point.position.lng()})\n`
    }


    pairwise(clickedPoint, (a, b) => {
        const path = shapeData.getSubLine([a.position.lat(), a.position.lng()], [b.position.lat(), b.position.lng()]);
        const encodeString = google.maps.geometry.encoding.encodePath(path);

        htmlString += `Encoding path: ${encodeString}`;
    });

    document.querySelector("#info_wrapper_inner").innerHTML = htmlString + "</div>";

}
