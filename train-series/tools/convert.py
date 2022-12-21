""" Convert raw txt file to json format """

import json

def main():
    type = ["EMU500", "EMU600", "EMU700", "EMU800", "EMU900"]

    data = []
    for t in type:
        with open(f'../raw/2022-12-28/{t}.txt', encoding='utf-8') as f:
            trainList = f.read().splitlines()
            result = convert(trainList)
            data += result

    print(data)

    with open('../temp.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


def convert(trainList):
    series = trainList[0]

    trainNo = [ x[:4] for x in trainList[1:] ]

    return [{
        'name': series,
        'train': list(map(lambda x: {'no': x}, trainNo))
    }]


if __name__ == '__main__':
    main()