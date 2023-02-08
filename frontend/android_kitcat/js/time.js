const APIKEY = "REPLACEME"
const HEFENG_KEY = "REPLACEME"
const CURR_POS = "REPLACEME"
const elegentSentence = "https://apis.tianapi.com/one/index"
const DateQuery = "https://apis.tianapi.com/lunar/index"
const TempQuery = "http://REPLACEME/getTempHm"
const NowWeatherQuery = "https://devapi.qweather.com/v7/weather/now"
const WarningQuery = "https://devapi.qweather.com/v7/warning/now"
const aqQuery = "https://devapi.qweather.com/v7/air/now"
const thinkQuery = "https://apis.tianapi.com/naowan/index"
var lastDay = ""
var txtwarning = ""
var pageCount = 1
var thinkPageCount = 1
var someDay = false
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
	if (dateString != lastDay) {
		document.getElementById("date").innerHTML = dateString
		document.getElementById("week").innerHTML = weekString
		updateLunar()
		putElegentSentence()
	}
	lastDay = dateString
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
			if (resp.inside.bat != undefined) {
				document.getElementById("inTemp").innerHTML = parseFloat(resp.inside.temp).toFixed(1) + "°C"
				document.getElementById("inHumi").innerHTML = parseFloat(resp.inside.humi).toFixed(1) + "%"
				document.getElementById("inBat").innerHTML = resp.inside.bat + "%"
			}
			if (resp.outside.bat != undefined) {
				document.getElementById("outTemp").innerHTML = parseFloat(resp.outside.temp).toFixed(1) + "°C"
				document.getElementById("outHumi").innerHTML = parseFloat(resp.outside.humi).toFixed(1) + "%"
				document.getElementById("outBat").innerHTML = resp.outside.bat + "%"
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
			if (finalAns=="") {
				updateThink()
				someDay = false
				return
			}
			someDay=true
			document.getElementById("festival").style.fontSize = "2rem"
			document.getElementById("festival").innerHTML = finalAns
		}
	}
}

function putPicByPower(pwr, isCharging) {
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
	navigator.getBattery().then(function (battery) {
		document.getElementById("batteryLevel").innerHTML = battery.level * 100 + "%"
		putPicByPower(battery.level * 100, battery.charging)
		battery.addEventListener("chargingchange", function () {
			putPicByPower(battery.level * 100, battery.charging)
		});
		battery.addEventListener("levelchange", function () {
			document.getElementById("batteryLevel").innerHTML = battery.level * 100 + "%"
			putPicByPower(battery.level * 100, battery.charging)
		});
	});
}

function putElegentSentence() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', elegentSentence + "?rand=1&key=" + APIKEY, true);
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
			if ((word + "&nbsp;&nbsp;" + wordOrgn).length>60){
				// console.log("loading")
				putElegentSentence()
				return
			}
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
			if (resp.warning == []) {
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

function alertWarning() {
	alert(txtwarning)
}

function updateGraph() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', GraphGen, true);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var data = httpRequest.responseText;
			document.getElementById("tempGraph").src = "data:image/png;base64," + data
		}
	}
}

function switcher() {
	if (pageCount % 2 == 1) {
		document.getElementById("he-plugin-standard").style.zIndex = 1
		document.getElementById("he-plugin-standard").style.display = "none"
		document.getElementById("tempGraph").style.zIndex = 2
		document.getElementById("tempGraph").style.display = ""
		document.getElementById("sentence").style.display = "none"
		updateGraph()
	} else {
		document.getElementById("he-plugin-standard").style.zIndex = 2
		document.getElementById("he-plugin-standard").style.display = ""
		document.getElementById("tempGraph").style.zIndex = 1
		document.getElementById("tempGraph").style.display = "none"
		document.getElementById("sentence").style.display = ""
	}
	pageCount += 1
}
function guess() {
	if (someDay){return}
	if (thinkPageCount % 2 == 1) {
		document.getElementById("festival").style.zIndex = 1
		document.getElementById("festival").style.display = "none"
		document.getElementById("think").style.zIndex = 2
		document.getElementById("think").style.display = "flex"
	} else {
		updateThink()
		document.getElementById("festival").style.zIndex = 2
		document.getElementById("festival").style.display = "flex"
		document.getElementById("think").style.zIndex = 1
		document.getElementById("think").style.display = "none"
	}
	thinkPageCount += 1
}
function updateThink(){
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
			document.getElementById("festival").style.fontSize = "20px"
			if (resp.result.list[0].quest.length>46|| resp.result.list[0].result.length>18){
				updateThink()
				return
			}
			document.getElementById("festival").innerHTML = resp.result.list[0].quest
			document.getElementById("think").innerHTML = resp.result.list[0].result
		}
	}
}
// updatePower()
// updateGraph()
// putElegentSentence()
updateWarning()
updateNowWeather()
updateTemp()
updateTime()
// updateLunar()
setInterval("updateWarning()", 30 * 60 * 1000)
setInterval("updateTime()", 1 * 1000)
setInterval("updateTemp()", 30 * 1000)
setInterval("updateNowWeather()", 30 * 60 * 1000)
