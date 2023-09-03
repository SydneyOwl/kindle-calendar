const elegentSentence = "http://【请替换006】:3649/elegent"
const DateQuery = "http://【请替换007】:3649/lunar"
const WarningQuery = "http://【请替换008】:3649/warning"
var lastDay = ""
var pageCount = 1
var thinkPageCount = 1
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

	var timeString = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
	var dateString = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
	var weekList = ['SAT', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
	var weekChinese = ['日','一','二','三','四','五','六']
	var weekString = weekList[date.getDay()]
	// if (dateString != lastDay) {
	document.getElementById("date").innerHTML = dateString
	document.getElementById("week").innerHTML = weekString
	// updateLunar()
	// putElegentSentence()
	// }
	lastDay = dateString
	document.getElementById("time").innerHTML = timeString
}

function updateLunar() {
	var today = formatDate(new Date())
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', DateQuery, true);
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
				finalAns += "&nbsp;&nbsp;" + lunar_festival
			}
			if (festival != "") {
				finalAns += "&nbsp;&nbsp;" + festival
			}
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
	var power = 0
	var charge = ""
	queryArray.forEach(element => {
		var tmp = element.split("=")
		if (tmp[0] == "batt") {
			power = parseInt(tmp[1], 10)
			// putPicByPower(parseInt(tmp[1], 10))
			// return
		}
		if (tmp[0] == "charge") {
			charge = tmp[1]
		}
	});
	putPicByPower(power, charge == "Charging")
}

function putElegentSentence() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', elegentSentence, true);
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

function updateWarning() {
	var httpRequest = new XMLHttpRequest();
	httpRequest.open('GET', WarningQuery, true);
	httpRequest.send();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			var data = httpRequest.responseText;
			var resp = JSON.parse(data)
			if (resp.code != 200) {
				return
			}
			if (resp.warning.length == 0) {
				return
			}
			var iconCode = resp.warning[0].type.replace(/[^0-9]/ig, "")
			var weatherText = resp.warning[0].title
			if (weatherText.length > 18) {
				weatherText = weatherText.substring(0, 30) + "..."
			}
			document.getElementById("warnIcon").src = "./img/icons/" + iconCode + ".svg"
			document.getElementById("warnText").innerHTML = weatherText
			document.getElementById("sentence").style.display="none"
		}
	}
}
updatePower()
putElegentSentence()
updateTime()
updateLunar()
updateWarning()