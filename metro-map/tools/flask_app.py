from flask import Flask, current_app
import requests

app = Flask(__name__)
app.static_folder = "../"

@app.route('/<path:path>')
def send(path):
    return current_app.send_static_file(path)

@app.route('/station_list/<path:path>')
def get(path):
    r = requests.get(f'https://api.transtaiwan.com/station_list/{path}')
    return r.text

if __name__ == "__main__":
    app.run(debug=True)
