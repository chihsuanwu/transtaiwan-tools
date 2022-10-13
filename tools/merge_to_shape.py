import json
import polyline


def readJson(fileName):
    with open(fileName, "r") as f:
        originJson = json.load(f) 
        return originJson


def saveJson(fileName, newJson):
    with open(fileName, "w") as f:
        json.dump(newJson, f)


def mergeToOrigin(lineJson: list, speedJson: list, stationJson: list):
    
    lineNames = [l["name"] for l in lineJson]

    lineAndSpeed = []
    for lineName in lineNames:
        line = next(l for l in lineJson if l["name"] == lineName)['line']
        speed = next(l for l in speedJson if l["name"] == lineName)['speed']

        indexBasedSpeed = []
        for data in speed:
            latLngFrom = data["from"]
            latLngTo = data["to"]

            fromIndex = line.index(latLngFrom)
            toIndex = line.index(latLngTo)

            del data["from"]
            del data["to"]
            data["fromIndex"] = fromIndex
            data["toIndex"] = toIndex

            indexBasedSpeed.append(data)

        lineAndSpeed.append(
            {
                "name": lineName,
                "line": polyline.encode(line),
                "speed": indexBasedSpeed
            }
        )

    stationDict = {}
    for station in stationJson:
        uid = station["uid"]
        latlng = station["latlng"]
        lineIn = station["line"]

        indexBasedData = []
        for lineName in lineIn:
            line = next(l for l in lineJson if l["name"] == lineName)['line']
            index = line.index(latlng)
            indexBasedData.append(
                {
                    "line": lineName,
                    "index": index
                }
            )

        stationDict[uid] = {
            "latlng": polyline.encode([latlng]),
            "index": indexBasedData
        }
        
    return {
        "lines": lineAndSpeed,
        "station": stationDict
    }




def mergeMain():
    # keys = ["tra", "thsr", 'trtc', 'krtc', 'tymc', 'tmrt', 'klrt', 'ntdlrt']
    keys = ['klrt']
    for key in keys:
        print(key)
        lineJson = readJson(f"../{key}/line.json")
        speedJson = readJson(f"../{key}/speed.json")
        stationJson = readJson(f"../{key}/station.json")

        origin = mergeToOrigin(lineJson, speedJson, stationJson)

        saveJson(f"../{key}/shape.json", origin)



if __name__ == '__main__':
    # migrateMain()
    mergeMain()