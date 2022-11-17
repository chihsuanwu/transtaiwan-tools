const DRAW = "ZH";
// const DRAW = "EN";
// const DRAW = "JA";

let station_decode = {};

window.onload = () => {
    decode_station();
    
    drawFull();
    drawSingle("R");
    drawSingle("O");
    drawSingle("C");
}

function decode_station() {
    for (station_data of stations) {
        for (id of station_data["ids"]) {
            let key = "";
            switch (DRAW) {
                case "ZH":
                    key = "name";
                    break;
                case "EN":
                    key = "name_en";
                    break;
                case "JA":
                    key = "name_ja";
                    break;
            }
            station_decode[id] = station_data[key];
        }
    }
}

function drawFull() {
    const c = document.getElementById("canvas_full");
    
    for (const lineID in data["full"]["line"]) {
        const lines = data["full"]["line"][lineID];
        for (const line of lines) {
            drawLine(lineID, line, c);
        }
    }

    for (const lineID in data["full"]["station"]) {
        const stations = data["full"]["station"][lineID];
        for (const station of stations) {
            drawStation(lineID, station, c);
        }
    }
}

function drawSingle(line) {
    const c = document.getElementById(`canvas_${line}`);
    for (const lineID in data[line]["station"]) {
        const stations = data[line]["station"][lineID];
        for (const station of stations) {
            drawSingleStation(lineID, station, c);
        }
    }
}


const SCALE = 24 * 2;
const OFFSET = 2000;

const COLOR = {
    "R": "#e20b65",
    "O": "#faa73f",
    "C": "#7cbd52",
    "External": "#CCCCCC",
}

const CIRCLE_INNER_RADIUS = 10.8 * 2
const CIRCLE_CENTER_RADIUS = 12.6 * 2
const TERMINAL_CIRCLE_RADIUS = 16 * 2
const TRANSFER_OFFSET = 10 * 2
const TERMINAL_TRANSFER_TEXT_OFFSET = 1.6 * 2
const STROKE = 3.6 * 2
const SPACE = 3.2 * 2

const NAME_SPACE = 20 * 2
const NAME_SPACE_LARGE = 32 * 2

const LINE_WIDTH = 6 * 2

const TEXT_SIZE = (DRAW == "ZH" || DRAW == "JA") ? 26 : 16;

function drawStation(lineID, station, c) {
    const pos = station["pos"]; 
    const posX = scale(pos[0]), posY = scale(pos[1]);

    let ctx = c.getContext("2d");
    
    ctx.beginPath();

    switch (station["type"]) {
        case "TR": {
            ctx.moveTo(posX, posY - CIRCLE_CENTER_RADIUS);
            ctx.lineTo(posX + TRANSFER_OFFSET, posY - CIRCLE_CENTER_RADIUS);
            ctx.arc(posX + TRANSFER_OFFSET, posY, CIRCLE_CENTER_RADIUS, 1.5 * Math.PI, 0.5 * Math.PI);
            ctx.lineTo(posX, posY + CIRCLE_CENTER_RADIUS);
            break;
        }
        case "LTR": {
            ctx.moveTo(posX, posY - TERMINAL_CIRCLE_RADIUS + STROKE / 2);
            ctx.lineTo(posX + TRANSFER_OFFSET, posY - TERMINAL_CIRCLE_RADIUS + STROKE / 2);
            ctx.arc(posX + TRANSFER_OFFSET, posY, TERMINAL_CIRCLE_RADIUS - STROKE / 2, 1.5 * Math.PI, 0.5 * Math.PI);
            ctx.lineTo(posX, posY + TERMINAL_CIRCLE_RADIUS - STROKE / 2);
            break;
        }
        case "TER-TR": {
            ctx.moveTo(posX, posY - TERMINAL_CIRCLE_RADIUS);
            ctx.lineTo(posX + TRANSFER_OFFSET, posY - TERMINAL_CIRCLE_RADIUS);
            ctx.arc(posX + TRANSFER_OFFSET, posY, TERMINAL_CIRCLE_RADIUS, 1.5 * Math.PI, 0.5 * Math.PI);
            ctx.lineTo(posX, posY + TERMINAL_CIRCLE_RADIUS);
            break;
        }
        // case "LTL":
        case "TL": {
            ctx.moveTo(posX, posY + CIRCLE_CENTER_RADIUS);
            ctx.lineTo(posX - TRANSFER_OFFSET, posY + CIRCLE_CENTER_RADIUS);
            ctx.arc(posX - TRANSFER_OFFSET, posY, CIRCLE_CENTER_RADIUS, 0.5 * Math.PI, 1.5 * Math.PI);
            ctx.lineTo(posX, posY - CIRCLE_CENTER_RADIUS);
            break;
        }
        case "TER-TL": {
            ctx.moveTo(posX, posY + TERMINAL_CIRCLE_RADIUS);
            ctx.lineTo(posX - TRANSFER_OFFSET, posY + TERMINAL_CIRCLE_RADIUS);
            ctx.arc(posX - TRANSFER_OFFSET, posY, TERMINAL_CIRCLE_RADIUS, 0.5 * Math.PI, 1.5 * Math.PI);
            ctx.lineTo(posX, posY - TERMINAL_CIRCLE_RADIUS);
            break;
        }
        case "TER-T":
        case "TER": {
            ctx.arc(posX, posY, TERMINAL_CIRCLE_RADIUS, 0, 2 * Math.PI);
            break;
        }
        default: {
            ctx.arc(posX, posY, CIRCLE_CENTER_RADIUS, 0, 2 * Math.PI);
        }
    }


    switch (station["type"]) {
        case "T":
        case "LTR":
        case "LTL":
        case "TR":
        case "TL": {
            ctx.lineWidth = STROKE + SPACE * 2;
            ctx.strokeStyle = "#FFFFFF";
            ctx.stroke();
            break
        }
        
        case "TER-T":
        case "TER-TR":
        case "TER-TL": {
            ctx.lineWidth = SPACE * 2;
            ctx.strokeStyle = "#FFFFFF";
            ctx.stroke();
            break
        }
    } 

    switch (station["type"]) {
        case "TER":
        case "TER-T":
        case "TER-TR":
        case "TER-TL": {
            ctx.fillStyle = COLOR[lineID];
            break
        }
        default: {
            ctx.fillStyle = "#FFFFFF";
        }
    } 
    ctx.fill();
    
    switch (station["type"]) {
        case "TER":
        case "TER-T":
        case "TER-TR":
        case "TER-TL": {
            break
        }
        default: {
            ctx.lineWidth = STROKE;
            ctx.strokeStyle = COLOR[lineID];
            ctx.stroke();
        }
    } 
    
    
    ctx.font = `bold ${26}px Arial`;
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    switch (station["type"]) {
        case "TER":
        case "TER-T":
        case "TER-TR":
        case "TER-TL": {
            ctx.fillStyle = "#FFFFFF";
            break
        }
        default: {
            ctx.fillStyle = COLOR[lineID];
        }
    };

    const id = station["id"]
    
    switch (station["type"]) {
        case "TR":
        case "LTR": {
            ctx.fillText(id, posX + TRANSFER_OFFSET, posY + 2);
            break;
        }
        case "TER-TR": {
            if (lineID != "R22A" && lineID != "G03A") {
                ctx.fillText(lineID, posX + TRANSFER_OFFSET + 1, posY - 12);
                ctx.fillText(id, posX + TRANSFER_OFFSET + 1, posY + 16);
            } else {
                ctx.fillText(id, posX + TRANSFER_OFFSET + 1, posY + 2);
            }
            
            break;
        }
        case "TL": {
            ctx.fillText(id, posX - TRANSFER_OFFSET, posY + 2);
            break;
        }
        case "TER-TL": {
            if (lineID != "R22A" && lineID != "G03A") {
                ctx.fillText(lineID, posX - TRANSFER_OFFSET - 1, posY - 12);
                ctx.fillText(id, posX - TRANSFER_OFFSET - 1, posY + 16);
            } else {
                ctx.fillText(id, posX - TRANSFER_OFFSET - 1, posY + 1);
            }
            break;
        }
        case "TER-T":
        case "TER": {
            if (lineID != "R22A" && lineID != "G03A") {
                ctx.fillText(lineID, posX, posY - 12);
                ctx.fillText(id, posX, posY + 16);
            } else {
                ctx.fillText(id, posX, posY + 2);
            }
            break;
        }
        default: {
            ctx.fillText(id, posX, posY + 2);
        }
    };
    
    let line = lineID;
    if (line == "G03A") {
        line = "G";
    }
    if (line == "R22A") {
        line = "R";
    }
    const name = station_decode[line+id];

    let break_key = "";
    switch (DRAW) {
        case "ZH":
            break_key = "break";
            break;
        case "EN":
            break_key = "break_en";
            break;
        case "JA":
            break_key = "break_ja";
            break;
    }

    const slice = station[break_key];
    let name_line_1 = "";
    let name_line_2 = "";
    if (slice != null) {
        name_line_1 = name.slice(0, slice);
        name_line_2 = name.slice(slice);
    } else {
        name_line_1 = name;
    }

    ctx.fillStyle = "#000000";
    ctx.font = `bold ${TEXT_SIZE}px Arial`;
    switch (station["dir"]) {
        case "B": {
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            if (slice != null) {
                if ((DRAW == "EN" && station["name_offset_en"] == "R") || (DRAW == "ZH" && station["name_offset"] == "R")) {
                    ctx.textAlign = "left";
                } 
                if ((DRAW == "EN" && station["name_offset_en"] == "L") || (DRAW == "ZH" && station["name_offset"] == "L")) {
                    ctx.textAlign = "right";
                } 
                ctx.fillText(name_line_1, posX, posY + NAME_SPACE);
                ctx.fillText(name_line_2, posX, posY + NAME_SPACE + TEXT_SIZE);
            } else {
                if ((DRAW == "EN" && station["name_offset_en"] == "R") || (DRAW == "ZH" && station["name_offset"] == "R")) {
                    ctx.textAlign = "left";
                } 
                if ((DRAW == "EN" && station["name_offset_en"] == "L") || (DRAW == "ZH" && station["name_offset"] == "L")) {
                    ctx.textAlign = "right";
                } 
                ctx.fillText(name_line_1, posX, posY + NAME_SPACE);
            }
            
            break;
        }
        case "R": {
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            if (slice != null) {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY - 10);
                ctx.fillText(name_line_2, posX+NAME_SPACE, posY + 10);
            } else {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY);
            }
            break;
        }
        case "RR": {
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            if (slice != null) {
                ctx.fillText(name_line_1, posX+NAME_SPACE_LARGE, posY - 10);
                ctx.fillText(name_line_2, posX+NAME_SPACE_LARGE, posY + 10);
            } else {
                ctx.fillText(name_line_1, posX+NAME_SPACE_LARGE, posY);
            }
            break;
        }
        case "TR": {
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            if (slice != null) {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY - NAME_SPACE - TEXT_SIZE);
                ctx.fillText(name_line_2, posX+NAME_SPACE, posY - NAME_SPACE);
            } else {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY - NAME_SPACE);
            }
            break;
        }
        case "BR": {
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            if (slice != null) {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY + NAME_SPACE);
                ctx.fillText(name_line_2, posX+NAME_SPACE, posY + NAME_SPACE + TEXT_SIZE);
            } else {
                ctx.fillText(name_line_1, posX+NAME_SPACE, posY + NAME_SPACE);
            }
            break;
        }
        case "BL": {
            ctx.textAlign = "right";
            ctx.textBaseline = "top";
            if (slice != null) {
                ctx.fillText(name_line_1, posX-NAME_SPACE, posY + NAME_SPACE);
                ctx.fillText(name_line_2, posX-NAME_SPACE, posY + NAME_SPACE + TEXT_SIZE);
            } else {
                ctx.fillText(name_line_1, posX-NAME_SPACE, posY + NAME_SPACE);
            }
            break;
        }
        case "L": {
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            if (slice != null) {
                ctx.fillText(name_line_1, posX-NAME_SPACE, posY - 10);
                ctx.fillText(name_line_2, posX-NAME_SPACE, posY + 10);
            } else {
                ctx.fillText(name_line_1, posX-NAME_SPACE, posY);
            }
            break;
        }
        case "LL": {
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            if (slice != null) {
                ctx.fillText(name_line_1, posX-NAME_SPACE_LARGE, posY - 10);
                ctx.fillText(name_line_2, posX-NAME_SPACE_LARGE, posY + 10);
            } else {
                ctx.fillText(name_line_1, posX-NAME_SPACE_LARGE, posY);
            }
            break;
        }
        case "T": {
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            if (slice != null) {
                if ((DRAW == "EN" && station["name_offset_en"] == "R") || (DRAW == "ZH" && station["name_offset"] == "R")) {
                    ctx.textAlign = "left";
                } 
                if ((DRAW == "EN" && station["name_offset_en"] == "L") || (DRAW == "ZH" && station["name_offset"] == "L")) {
                    ctx.textAlign = "right";
                } 
                ctx.fillText(name_line_1, posX, posY - NAME_SPACE - TEXT_SIZE);
                ctx.fillText(name_line_2, posX, posY - NAME_SPACE);
            } else {
                if ((DRAW == "EN" && station["name_offset_en"] == "R") || (DRAW == "ZH" && station["name_offset"] == "R")) {
                    ctx.textAlign = "left";
                } 
                if ((DRAW == "EN" && station["name_offset_en"] == "L") || (DRAW == "ZH" && station["name_offset"] == "L")) {
                    ctx.textAlign = "right";
                } 
                ctx.fillText(name_line_1, posX, posY - NAME_SPACE);
            }
            
            break;
        }
        default: {
            
        }
    };
}

function drawLine(lineID, line, c) {
    const alpha = line["note"] == "out_of_service" ? 0.2 : 1;
    switch (line["type"]) {
        case "L": {
            drawSimpleLine(lineID, line["pts"], alpha, c);
            break;
        }
        case "Q": {
            drawQLine(lineID, line["pts"], alpha, c);
            break;
        }
        case "2Q": {
            drawDoubleQLine(lineID, line["pts"], alpha, c);
            break;
        }
    }
}

function drawSimpleLine(lineID, args, alpha, c) {
    const fromX = scale(args[0]), fromY = scale(args[1]);
    const toX = scale(args[2]), toY = scale(args[3]);

    let ctx = c.getContext("2d");
    ctx.lineWidth = LINE_WIDTH;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = COLOR[lineID];
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.globalAlpha = 1;

}

function drawQLine(lineID, args, alpha, c) {
    const fromX = scale(args[0]), fromY = scale(args[1]);
    const qStartX = scale(args[2]), qStartY = scale(args[3]);
    const qCtrX = scale(args[4]), qCtrY = scale(args[5]);
    const qEndX = scale(args[6]), qEndY = scale(args[7]);
    const toX = scale(args[8]), toY = scale(args[9]);

    let ctx = c.getContext("2d");
    ctx.lineWidth = LINE_WIDTH;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = COLOR[lineID];
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(qStartX, qStartY);
    ctx.quadraticCurveTo(qCtrX, qCtrY, qEndX, qEndY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawDoubleQLine(lineID, args, alpha, c) {
    const fromX = scale(args[0]), fromY = scale(args[1]);
    const q1StartX = scale(args[2]), q1StartY = scale(args[3]);
    const q1CtrX = scale(args[4]), q1CtrY = scale(args[5]);
    const q1EndX = scale(args[6]), q1EndY = scale(args[7]);
    const q2StartX = scale(args[8]), q2StartY = scale(args[9]);
    const q2CtrX = scale(args[10]), q2CtrY = scale(args[11]);
    const q2EndX = scale(args[12]), q2EndY = scale(args[13]);
    const toX = scale(args[14]), toY = scale(args[15]);

    let ctx = c.getContext("2d");
    ctx.lineWidth = LINE_WIDTH;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = COLOR[lineID];
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(q1StartX, q1StartY);
    ctx.quadraticCurveTo(q1CtrX, q1CtrY, q1EndX, q1EndY);
    ctx.lineTo(q2StartX, q2StartY);
    ctx.quadraticCurveTo(q2CtrX, q2CtrY, q2EndX, q2EndY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function scale(value) {
    return value * SCALE + OFFSET
}

function drawSingleStation(lineID, station, c) {
    const pos = station["pos"]; 
    const type = station["type"];
    let off = 0;
    if (type == "R") off = 200;
    if (type == "L") off = -200; 
    const posX = sinle_scale(pos[0]) + off, posY = sinle_scale(pos[1]);

    let ctx = c.getContext("2d");
    
    ctx.beginPath();

    ctx.arc(posX, posY, CIRCLE_CENTER_RADIUS, 0, 2 * Math.PI);

    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    
    ctx.lineWidth = STROKE;
    ctx.strokeStyle = COLOR[lineID];
    ctx.stroke();
    
    
    ctx.font = `bold ${26}px Arial`;
    
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = COLOR[lineID];

    const id = station["id"]
    ctx.fillText(id, posX, posY + 2);
    
}


const SINGLE_SCALE = 36 * 2;
const SINGLE_OFFSET = 1600;
function sinle_scale(value) {
    return value * SINGLE_SCALE + SINGLE_OFFSET
}
