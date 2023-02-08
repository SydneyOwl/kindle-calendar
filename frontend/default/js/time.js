const APIKEY = ""
const HEFENG_KEY = ""
const CURR_POS = ""
const elegentSentence = "http://localhost:3649/elegent"
const DateQuery = "http://localhost:3649/lunar"
const TempQuery = "https://localhost:3649/sensorData"
const NowWeatherQuery = "http://localhost:3649/weather"
const WarningQuery = "http://localhost:3649/warning"
const thinkQuery = "http://localhost:3649/think"
var lastDay = ""
function formatDate(date) {
	var year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate()
	var newTime = year + '-' +
		(month < 10 ? '0' + month : month) + '-' +
		(day < 10 ? '0' + day : day)
	return newTime;
}

function updateTime() {
	var date = new Date()
	var utc8DiffMinutes = date.getTimezoneOffset() + 480
	date.setMinutes(date.getMinutes() + utc8DiffMinutes)

	var timeString = date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2)
	var dateString = (date.getMonth() + 1) + '月' + date.getDate() + '日'
	var weekList = ['日', '一', '二', '三', '四', '五', '六']
	var weekString = '星期' + weekList[date.getDay()]
	// if (dateString != lastDay) {
	document.getElementById("date").innerHTML = dateString
	document.getElementById("week").innerHTML = weekString
	// updateLunar()
	// putElegentSentence()
	// }
	document.getElementById("time").innerHTML = timeString
}

function updateTemp() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', TempQuery, true);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var data = httpRequest.responseText;
			var resp = JSON.parse(data)
			if (resp.inside.power != undefined) {
				document.getElementById("inTemp").innerHTML = parseFloat(resp.inside.temperature).toFixed(1) + "°C"
				document.getElementById("inHumi").innerHTML = parseFloat(resp.inside.humidity).toFixed(1) + "%"
				var lastGet = resp.inside.time
				var now = new Date()
				var utc8DiffMinutes = now.getTimezoneOffset() + 480
				now.setMinutes(now.getMinutes() + utc8DiffMinutes)
				var left = parseInt((now.getTime() - new Date(lastGet).getTime()) / 60000).toString(10)
				var minbef = ""
				if (left == "0") {
					minbef = "刚刚"
				} else {
					minbef = left + "分钟前"
				}
				document.getElementById("inUpdateTime").innerHTML = minbef
				document.getElementById("inBat").innerHTML = resp.inside.power + "%"
			}
			if (resp.outside.power != undefined) {
				document.getElementById("outTemp").innerHTML = parseFloat(resp.outside.temperature).toFixed(1) + "°C"
				document.getElementById("outHumi").innerHTML = parseFloat(resp.outside.humidity).toFixed(1) + "%"
				var lastGet = resp.outside.time
				var now = new Date()
				var utc8DiffMinutes = now.getTimezoneOffset() + 480
				now.setMinutes(now.getMinutes() + utc8DiffMinutes)
				var left = parseInt((now.getTime() - new Date(lastGet).getTime()) / 60000).toString(10)
				var minbef = ""
				if (left == "0") {
					minbef = "刚刚"
				} else {
					minbef = left + "分钟前"
				}
				document.getElementById("outUpdateTime").innerHTML = minbef
				document.getElementById("outBat").innerHTML = resp.outside.power + "%"
			}
		}
	}
}

function updateLunar() {
	var today = formatDate(new Date())
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', DateQuery + "?key=" + APIKEY + "&date=" + today, true);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var data = httpRequest.responseText;
			var resp = JSON.parse(data)
			if (resp.code != 200) {
				return
			}
			var dayString = "农历" + resp.result.lubarmonth + resp.result.lunarday
			var jieqi = resp.result.jieqi
			var lunar_festival = resp.result.lunar_festival
			var festival = resp.result.festival
			document.getElementById("lunar").innerHTML = dayString
			var finalAns = ""
			if (jieqi != "") {
				finalAns += jieqi
			}
			if (lunar_festival != "") {
				finalAns += "&nbsp;&nbsp;&nbsp;&nbsp;" + lunar_festival
			}
			if (festival != "") {
				finalAns += "&nbsp;&nbsp;&nbsp;&nbsp;" + festival
			}
			if (finalAns == "") {
				document.getElementById("festival").style.fontSize = '30px'
				updateThink()
				return
			}
			document.getElementById("festival").style.fontSize = '2rem'
			document.getElementById("festival").style.top = '20px'
			document.getElementById("festival").innerHTML = finalAns
		}
	}
}

function putPicByPower(pwr, isCharging) {
	document.getElementById("batteryLevel").innerHTML = pwr.toString() + "%"
	if (!isCharging) {
		if (pwr > 75) {
			document.getElementById("batt").src = "./img/bat_100.png"
		} else if (pwr <= 75 && pwr > 50) {
			document.getElementById("batt").src = "./img/bat_75.png"
		} else if (pwr <= 50 && pwr > 25) {
			document.getElementById("batt").src = "./img/bat_50.png"
		} else {
			document.getElementById("batt").src = "./img/bat_25.png"
		}
	} else {
		document.getElementById("batt").src = "./img/rec.png"
	}
}

function updatePower() {
	var queryArray = window.location.search.replace("?", "").split("&")
	queryArray.forEach(element => {
		var tmp = element.split("=")
		if (tmp[0] == "batt") {
			putPicByPower(parseInt(tmp[1], 10))
			return
		}
	});
}

function putElegentSentence() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', elegentSentence + "?key=" + APIKEY, true);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var data = httpRequest.responseText;
			var resp = JSON.parse(data)
			if (resp.code != 200) {
				return
			}
			var word = "\"" + resp.result.word + "\""
			var wordOrgn = resp.result.wordfrom
			var final = word + "&nbsp;&nbsp;" + wordOrgn
			// console.log(final.length)
			document.getElementById("sentence").innerHTML = word + "&nbsp;&nbsp;" + wordOrgn
		}
	}
	return
}

function updateNowWeather() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', NowWeatherQuery + "?key=" + HEFENG_KEY + "&location=" + CURR_POS, true);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var data = httpRequest.responseText;
			var resp = JSON.parse(data)
			if (resp.code != 200) {
				return
			}
			var iconCode = resp.now.icon
			var weatherText = resp.now.text
			document.getElementById("wicon").src = "./img/icons/" + iconCode + ".svg"
			document.getElementById("weatherText").innerHTML = weatherText
		}
	}
}

function updateWarning() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', WarningQuery + "?key=" + HEFENG_KEY + "&location=" + CURR_POS, true);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var data = httpRequest.responseText;
			var resp = JSON.parse(data)
			if (resp.code != 200) {
				return
			}
			if (resp.warning.length == 0) {
				document.getElementById("warnIcon").src = ""
				document.getElementById("warnText").innerHTML = ""
				txtwarning = "没有预警信息"
				return
			}
			var iconCode = resp.warning[0].type.replace(/[^0-9]/ig, "")
			var weatherText = resp.warning[0].title
			if (weatherText.length > 18) {
				weatherText = weatherText.substring(0, 16) + "..."
			}
			document.getElementById("warnIcon").src = "./img/icons/" + iconCode + ".svg"
			document.getElementById("warnText").innerHTML = weatherText
			txtwarning = resp.warning[0].text
		}
	}
}
function updateThink() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', thinkQuery + "?key=" + APIKEY + "&num=" + '1', true);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var data = httpRequest.responseText;
			var resp = JSON.parse(data)
			if (resp.code != 200) {
				return
			}
			// document.getElementById("festival").innerHTML = resp.result.list[0].quest
			document.getElementById("festival").style.fontSize = "20px"
			document.getElementById("festival").innerHTML = resp.result.list[0].quest + "(答案：" + resp.result.list[0].result + ")"
		}
	}
}
updatePower()
// updateGraph()
putElegentSentence()
//init...
updateWarning()
updateNowWeather()
updateTemp()
updateTime()
updateLunar()
//SetInternal.....
// setInterval("updateWarning()", 30 * 60 * 1000)
// setInterval("updateTime()", 30 * 1000)
// setInterval("updateTemp()", 5 * 60 * 1000)
// setInterval("updateNowWeather()", 30 * 60 * 1000)
