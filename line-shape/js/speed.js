

let clickedPath = null;

function onMapClickSpeed() {
    if (clickedPath != null) {
        clickedPath.setMap(null);
    }
    clickedPath = null;
}

function drawSpeedData() {
    const addMenu = createAddMenu();
    const deleteMenu = createDeleteMenu();
  
    const subLines = shapeData.getAllSubLine();

    for (let line of subLines) {
        const subPath = new google.maps.Polyline({
            path: line["lineData"],
            strokeColor: getColor(selectedCompany, line["speedData"]["speed"]),
            strokeOpacity: 1,
            strokeWeight: 6,
            map: map,
        });

        mapItems.push(subPath);

        google.maps.event.addListener(subPath, 'click', function(e) { 
            showSubPathData(line, e); 
        });

        google.maps.event.addListener(subPath, "contextmenu", function(e) {
            let point = closestPointOnPath(e.latLng, subPath);
            addMenu.open(map, point.latLng, () => {

                const position = [point.latLng.lat(), point.latLng.lng()];

                shapeData.addSpeedSeperatePoint(line.speedData, position);

                drawAll();
            });
        });
    }

    pairwise(subLines, (current, next) => {
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
            position: next["lineData"][0],
            icon: svgMarker,
            map: map,
            draggable: true,
        });

        mapItems.push(marker);

        google.maps.event.addListener(marker, 'drag', function(e) {
            const closest = closestPoint(current, next, e);
            marker.setPosition(closest.latLng);
        });

        google.maps.event.addListener(marker, 'dragend', function(e) {
            const closest = closestPoint(current, next, e);
            const closestPosition = [closest.latLng.lat(), closest.latLng.lng()];

            shapeData.changeSpeedSeperatePoint(current, next, closestPosition);

            drawAll();
        });

        // Delete Menu
        google.maps.event.addListener(marker, "contextmenu", function(e) {
            deleteMenu.open(map, e.latLng, () => {
                const position = next["speedData"]["from"];

                shapeData.deleteSpeedSeperatePoint(position);

                drawAll();
            });
        });
    })
}

function closestPoint(prevLine, nextLine, marker) {
    const next = nextLine["lineData"];
    next.pop();
    const path = prevLine["lineData"].slice(1).concat(next);
    const flightPath = new google.maps.Polyline({ path: path });
    return closest = closestPointOnPath(marker.latLng, flightPath);
}

function showSubPathData(line, e) {
    const speedData = line["speedData"];
    const speed = speedData["speed"];
    const path = line["lineData"];
    const neutralSection = speedData["NS"] === true;

    const from = speedData["from"];
    const to = speedData["to"];

    document.querySelector("#info_wrapper_inner").innerHTML = `From (${from[0]}, ${from[1]}) to (${to[0]}, ${to[1]}), 
    max speed dir0: <input id="speed_d0" type="number" min="1" max="300" value = "${speed["dir0"]}" onchange="speedChange(this.value, ${from[0]}, ${from[1]} , 0)">, 
    dir1: <input id="speed_d1" type="number" min="1" max="300" value = "${speed["dir1"]}" onchange="speedChange(this.value, ${from[0]}, ${from[1]}, 1)"> 
    Neutral Section    <input type="checkbox" id="neutral_section" onchange="onNSChange(${from[0]}, ${from[1]})">`;

    if (neutralSection) {
        document.querySelector("#neutral_section").setAttribute("checked", "checked");
    }

    if (clickedPath != null) {
        clickedPath.setMap(null);
    }

    const highlightPath = new google.maps.Polyline({
        path: path,
        strokeColor: getColor(selectedCompany, speed),
        strokeOpacity: 1,
        strokeWeight: 9,
        map: map,
    });

    clickedPath = highlightPath;
}

function speedChange(speed, fromLat, fromLng, dir) {
    
    const data = shapeData.speed["speed"].find((e) => latlngEqule(e["from"], [fromLat, fromLng]));

    data["speed"][`dir${dir}`] = parseInt(speed);

    drawAll();
}

function onNSChange(fromLat, fromLng) {
    const check = document.querySelector("#neutral_section").checked;

    const data = shapeData.speed["speed"].find((e) => latlngEqule(e["from"], [fromLat, fromLng]));

    if (check) {
        data['NS'] = true;
    } else {
        delete data['NS'];
    }

    drawAll();
}
