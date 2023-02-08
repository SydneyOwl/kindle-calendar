import flask
import requests
import time
import datetime
import threading
from flask_cors import CORS
import traceback
APIKEY = "REPLACE_WITH_YOUR_KEY"
HEFENG_KEY = "REPLACE_WITH_YOUR_KEY"
CURR_POS = "REPLACE_WITH_YOUR_POS"
elegentSentenceQuery = "https://apis.tianapi.com/one/index"
DateQuery = "https://apis.tianapi.com/lunar/index"
NowWeatherQuery = "https://devapi.qweather.com/v7/weather/now"
WarningQuery = "https://devapi.qweather.com/v7/warning/now"
thinkQuery = "https://apis.tianapi.com/naowan/index"
elegentSentence = {}
lunar = {}
curWeatz = {}
warning = {}
think = {}
app = flask.Flask(__name__)
CORS(app, resources=r'/*')


@app.route("/warning")
def warning():
    return flask.jsonify(warning)


@app.route("/think")
def think():
    return flask.jsonify(think)


@app.route("/weather")
def weather():
    return flask.jsonify(curWeatz)


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
        time.sleep(5*60*60)


def updateLunar():
    global lunar
    while True:
        try:
            lunar = requests.get(DateQuery+"?key="+APIKEY+"&date=" +
                                 datetime.datetime.now().strftime("%Y-%m-%d")).json()
        except Exception:
            traceback.print_exc()
        time.sleep(1*60*60)


def updateWeather():
    global curWeatz
    while True:
        try:
            curWeatz = requests.get(
                NowWeatherQuery + "?key=" + HEFENG_KEY + "&location=" + CURR_POS).json()
        except Exception:
            traceback.print_exc()
        time.sleep(15*60)


def updateThink():
    global think
    while True:
        try:
            while True:
                think = requests.get(
                    thinkQuery + "?key=" + APIKEY + "&num=1").json()
                if (len(think["result"]["list"][0]["quest"])+len(think["result"]["list"][0]["result"])) < 30:
                    break
        except Exception:
            traceback.print_exc()
        time.sleep(15*60*60)


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
threading.Thread(target=updateWeather).start()
threading.Thread(target=updateThink).start()
threading.Thread(target=updateWarning).start()
app.run(port=3649)
