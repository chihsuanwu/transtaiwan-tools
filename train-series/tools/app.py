from flask import Flask, current_app
import requests

app = Flask(__name__)
app.static_folder = '../'

@app.route('/<path:path>')
def send(path):
    return current_app.send_static_file(path)


@app.route('/data')
def data():
    with open('../data/data.json') as f:
        return f.read()


@app.route('/remote/<path:path>')
def remote(path):
    url = f'https://api.transtaiwan.com/{path}'
    r = requests.get(url)
    return r.text



if __name__ == '__main__':
    app.run()