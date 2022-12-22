"""Merge data from data folder, and trim it to a single line json file"""

import json

def main():
    with open('../data/specified/date.json', encoding='utf-8') as f:
        dateList = json.load(f)

    specified = []
    for date in dateList:

        with open(f'../data/specified/{date["filename"]}', encoding='utf-8') as f:
            data = json.load(f)

        specified.append(
            {
                'from': date['from'],
                'to': date['to'],
                'series': data
            }
        )

    with open('../data/other.json', 'r', encoding='utf-8') as f:
        other = json.load(f)

    result = {
        'specified': specified,
        'other': other
    }

    result = json.dumps(result, ensure_ascii=False).replace(' ', '').replace('\n', '')

    with open('../data.json', 'w', encoding='utf-8') as f:
        f.write(result)


if __name__ == '__main__':
    main()