import flask
import requests
import time
import datetime
import threading
from flask_cors import CORS
import traceback
APIKEY = "【请替换000】"
HEFENG_KEY = "【请替换001】"
CURR_POS = "【请替换002】"
elegentSentenceQuery = "https://apis.tianapi.com/one/index"
DateQuery = "https://apis.tianapi.com/lunar/index"
WarningQuery = "https://devapi.qweather.com/v7/warning/now"
elegentSentence = {}
lunar = {}
warning = {}
app = flask.Flask(__name__)
CORS(app, resources=r'/*')


@app.route("/warning")
def warning():
    return flask.jsonify(warning)

@app.route("/lunar")
def lunar():
    return flask.jsonify(lunar)


@app.route("/elegent")
def sentence():
    return flask.jsonify(elegentSentence)


def updateElegentSentence():
    global elegentSentence
    while True:
        try:
            while True:
                elegentSentence = requests.get(
                    elegentSentenceQuery+"?key="+APIKEY+"&rand=1").json()
                if (len(elegentSentence["result"]["word"])+len(elegentSentence["result"]["wordfrom"])) < 60:
                    break
        except Exception:
            traceback.print_exc()
        time.sleep(60*60)


def updateLunar():
    global lunar
    while True:
        try:
            lunar = requests.get(DateQuery+"?key="+APIKEY+"&date=" +
                                 datetime.datetime.now().strftime("%Y-%m-%d")).json()
        except Exception:
            traceback.print_exc()
        time.sleep(1*60*60)

def updateWarning():
    global warning
    while True:
        try:
            warning = requests.get(
                WarningQuery + "?key=" + HEFENG_KEY + "&location=" + CURR_POS).json()
        except Exception:
            traceback.print_exc()
        time.sleep(15*60)


threading.Thread(target=updateElegentSentence).start()
threading.Thread(target=updateLunar).start()
threading.Thread(target=updateWarning).start()
app.run(host="0.0.0.0", port=3649)
