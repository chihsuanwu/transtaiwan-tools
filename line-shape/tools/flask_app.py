from flask import Flask, current_app

app = Flask(__name__)
app.static_folder = "../"

@app.route('/<path:path>')
def send(path):    
    return current_app.send_static_file(path)

if __name__ == "__main__":
    app.run(debug=True)
