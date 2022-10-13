function decode(encoded) {
    // array that holds the points
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
    while (index < len) {
        let b, shift = 0, result = 0;
        
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);

        let dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;

        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        
        let dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        points.push({lat: (lat / 1E5), lng: (lng / 1E5)})  
    }

    return points
}

function getColor(company, speed) {

    const s = ((company == "THSR" ? 300 : 130) - Math.min(speed["dir0"], speed["dir1"])) / (company == "THSR" ? 300 : 130);
    var h;
    if (s < (19 / 35)) {
        h = (Math.asin(s * 3.5 - .9) * 180 / Math.PI + 90) * (2 / 3);
    } else {
        h = 120 + (Math.asin(s * 3.5 - 2.9) * 180 / Math.PI + 90) * (2 / 3);
    }
    return hslToHex(h, 100, 50);
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function pairwise(arr, func) {
    for(var i=0; i < arr.length - 1; i++){
        func(arr[i], arr[i + 1])
    }
}

function closestPointOnPath(latlng, path) {
    var needle = {
        minDistance: 9999999999, //silly high
        index: -1,
        latLng: null
    };
    path.getPath().forEach(function(routePoint, index){
        // const latLng = {lat: latlng.lat(), lng: latlng.lng()};
        var dist = google.maps.geometry.spherical.computeDistanceBetween(latlng, routePoint);
        if (dist < needle.minDistance){
        needle.minDistance = dist;
        needle.index = index;
        needle.latLng = routePoint;
        }
    });
    // The closest point in the polyline
    // alert("Closest index: " + needle.index);

    // The clicked point on the polyline
    // alert(latlng);
    return needle;
}

function latlngEqule(a, b) {
    return a[0] == b[0] && a[1] == b[1]
}