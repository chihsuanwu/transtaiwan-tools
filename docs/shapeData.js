

class ShapeData {

    line;
    speed;
    station;

    init(line, speed, station) {
        this.line = line;
        this.speed = speed;
        this.station = station
    }

    updateSpeed(speed) {
        this.speed = speed;
    }

    getLineList() {
        let line = this.line["line"];
        return line.map((e) => { return {"lat": e[0], "lng": e[1]}; });
    }

    getAllSubLine() {
        let subLines = [];
        for (let speed of this.speed["speed"]) {
            const subLine = this.getSubLine(speed["from"], speed["to"]);
            subLines.push(
                {
                    "speedData": speed,
                    "lineData": subLine
                }
            );
        }

        return subLines;
    }

    getSubLine(fromPosition, toPosition) {
        let line = this.line["line"];
        let fromIndex = line.findIndex(
            (e) => latlngEqule(e, fromPosition)
        );
        let toIndex = line.findIndex(
            (e) => latlngEqule(e, toPosition)
        );

        return line.slice(fromIndex, toIndex + 1)
            .map((e) => { return {"lat": e[0], "lng": e[1]}; });
    }



    // Speed change

    addSpeedSeperatePoint(originSpeedData, seperatePoint) {
        const speedData = this.speed["speed"];

        let index = speedData.findIndex((e) => e == originSpeedData);
        if (index != -1) {
            let line1 = JSON.parse(JSON.stringify(originSpeedData)); // deep copy
            line1["to"] = seperatePoint;
            let line2 = JSON.parse(JSON.stringify(originSpeedData)); // deep copy
            line2["from"] = seperatePoint
            speedData[index] = line1;
            speedData.splice(index + 1, 0, line2);
        }

        this.speed["speed"] = speedData;
    }

    changeSpeedSeperatePoint(subLine1, subLine2, newPoint) {
        const speedData = this.speed["speed"]
        speedData.forEach((speed, index) => {
            if (latlngEqule(speed["from"], subLine1.speedData["from"])) {
                speed["to"] = newPoint;
                console.log(speed)
                speedData[index] = speed;
            }
            if (latlngEqule(speed["from"], subLine2.speedData["from"])) {
                speed["from"] = newPoint;
                speedData[index] = speed;
            }
        });
        this.speed["speed"] = speedData;
    }

    deleteSpeedSeperatePoint(position) {
        const speedData = this.speed["speed"];

        let index = speedData.findIndex((e) => latlngEqule(e["from"], position));
        if (index != -1) {
            speedData[index]["from"] = speedData[index - 1]["from"]
            speedData.splice(index - 1, 1);
        }

        this.speed["speed"] = speedData;
    }


    // shape change

    changeShapePoint(originPoint, newPoint) {
        if (!this._checkValidSpeedPoint(originPoint)) {
            return;
        }

        const index = this.line["line"].findIndex((e) => latlngEqule(e, originPoint));
        if (index != -1) {
            this.line["line"][index] = newPoint;
        }
    }

    deleteShapePoint(originPoint) {
        if (!this._checkValidSpeedPoint(originPoint)) {
            return;
        }

        const index = this.line["line"].findIndex((e) => latlngEqule(e, originPoint));
        if (index != -1) {
            this.line["line"].splice(index, 1);
        }
    }

    _checkValidSpeedPoint(point) {
        // find is in speed seperate point
        const speedData = this.speed["speed"];
        const seperate = speedData.find((e) => latlngEqule(e["from"], point) || latlngEqule(e["to"], point));
        if (seperate != undefined) {
            alert("This Point is SPEED SEPERATE POINT");
            return false;
        }

        // find is in station point
        const station = this.station.find((e) => latlngEqule(e["latlng"], point));
        if (station != undefined) {
            alert(`This Point is STATION POINT ${station["uid"]}`);
            return false;
        }

        return true;
    }
}