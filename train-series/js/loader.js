async function loadData() {

    if (DATA_SOURCE === "LOCAL") {
        const specifiedData = await loadLocalSpecifiedData();
        const otherData = await loadLocalOtherData();

        console.log(specifiedData);
        console.log(otherData);

        return {
            "specified": specifiedData,
            "other": otherData
        };
    }

    if (MODE == "DEPLOY") {
        const data = await fetch("https://api.transtaiwan.com/train_series/tra.json");
        return await data.json();
    }

    const data = await fetch("remote/train_series/tra.json");
    return await data.json();
}

async function loadLocalSpecifiedData() {
    const dateList = await (await fetch(`data/specified/date.json`)).json();
    let specifiedData = [];
    for (const date of dateList) {
        const name = date["filename"];
        const data = await (await fetch(`data/specified/${name}`)).json();
        specifiedData.push({
            "from": date["from"],
            "to": date["to"],
            "series": data
        });
    }

    return specifiedData;
}

async function loadLocalOtherData() {
    const data = await (await fetch(`data/other.json`)).json();
    return data;
}