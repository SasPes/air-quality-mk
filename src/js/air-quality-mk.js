// http://airquality.moepp.gov.mk/graphs/site/pages/MakeGraph.php?graph=StationLineGraph&station=Kumanovo&parameter=PM10&endDate=2016-11-11&timeMode=Day

var stations = [];
var station = "";
var parameter = "";
var currentDate = new Date();
currentDate = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();

var urlMoepp = "http://airquality.moepp.gov.mk/graphs/site/pages/";
var urlParams = urlMoepp + "Metadata.class.php?ajax=1&parametersForStation=" + station;

var params = ["CO", "NO2", "O3", "PM25", "PM10", "SO2"];
var data = [];

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback, param)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText, param);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

var callbackJson = function (res, param) {
    var jsonRes = JSON.parse(res);
    data = [];

    Object.keys(jsonRes.measurements).forEach(function (prop) {
        data.push([param, prop + ":00", jsonRes.measurements[prop][station]]);
    });

    for (var i = data.length - 1; i > 0; i--) {
        if (data[i][2] !== "") {
            document.getElementById(param).innerHTML = data[i][0] + " | " + data[i][2] + " | " + data[i][1];
            if (data[i][0] === "PM10") {
                setIconText(data[i][2]);
            }
            break;
        }
    }

//    console.log(data[data.length - 1]);
};

var setIconText = function (text) {
    var num = Math.round(text);
    chrome.browserAction.setBadgeText({text: num.toString()});

    if (num < 50) {
        chrome.browserAction.setBadgeBackgroundColor({"color": [0, 128, 0, 255]}); // zelena
    } else if (50 <= num && num < 100) {
        chrome.browserAction.setBadgeBackgroundColor({"color": [254, 203, 24, 255]}); // zolta
    } else if (100 <= num && num < 150) {
        chrome.browserAction.setBadgeBackgroundColor({"color": [255, 140, 0, 255]}); // portokalova
    } else if (150 <= num && num < 200) {
        chrome.browserAction.setBadgeBackgroundColor({"color": [255, 0, 0, 255]}); // crvena
    } else if (200 <= num) {
        chrome.browserAction.setBadgeBackgroundColor({"color": [128, 0, 0, 255]}); // temno crvena
    }
};

var getUrlReq = function () {
    return urlMoepp + "MakeGraph.php?graph=StationLineGraph&station=" + station + "&parameter=" + parameter + "&endDate=" + currentDate + "&timeMode=Day&background=false&i=" + new Date().getTime() + "&lang=mk";
};

var onChangeStation = function () {
    var myselect = document.getElementById("stations").getElementsByTagName('select')[0];
    localStorage.setItem('station', myselect.options[myselect.selectedIndex].value);
    station = localStorage.getItem('station');
    getData();
};

var getData = function () {
    for (var param in params) {
        parameter = params[param];
        document.getElementById(parameter).innerHTML = "\u043D\u0435\u043C\u0430 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0458\u0430";
        httpGetAsync(getUrlReq(), callbackJson, parameter);
    }
};

var init = function () {
    stations = httpGet("data/stations.json");
    stations = JSON.parse(stations);

    // stations prepare
    var div = document.getElementById("stations"),
            frag = document.createDocumentFragment(),
            select = document.createElement("select");
    for (var stat in stations) {
        select.options.add(new Option(stations[stat].name, stat));
    }
    frag.appendChild(select);
    div.appendChild(frag);

    // stations set
    station = localStorage.getItem('station');
    if (typeof station === 'undefined' || station === null) {
        localStorage.setItem('station', "Centar");
        station = localStorage.getItem('station');
    } else {
        select.querySelector("option[value=" + station + "]").selected = true;
    }
//    document.getElementById("station").innerHTML = station;

    // select addEventListener
    select.addEventListener("change", onChangeStation);

    // data get
    getData();
};

document.addEventListener('DOMContentLoaded', function () {
    init();
});

