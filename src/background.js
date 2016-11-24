var min = 15;
var station = "";
var parameter = "PM10";
var currentDate = new Date();
currentDate = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();

var urlMoepp = "http://airquality.moepp.gov.mk/graphs/site/pages/";

var getUrlReq = function () {
    return urlMoepp + "MakeGraph.php?graph=StationLineGraph&station=" + station + "&parameter=" + parameter + "&endDate=" + currentDate + "&timeMode=Day&background=false&i=" + new Date().getTime() + "&lang=mk";
};

var setIconText = function (text) {
    chrome.browserAction.setBadgeText({text: Math.round(text).toString()});
};

var callbackJson = function (res, param) {
    var jsonRes = JSON.parse(res);
    data = [];

    Object.keys(jsonRes.measurements).forEach(function (prop) {
        data.push([param, prop + ":00", jsonRes.measurements[prop][station]]);
    });

    for (var i = data.length - 1; i > 0; i--) {
        if (data[i][2] !== "") {
            setIconText(data[i][2]);
            break;
        }
    }
};

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

var init = function () {
    // stations set
    station = localStorage.getItem('station');
    if (typeof station === 'undefined' || station === null) {
        localStorage.setItem('station', "Centar");
        station = localStorage.getItem('station');
    }

    // data get
    httpGetAsync(getUrlReq(), callbackJson, parameter);
};

init();

window.setInterval(function () {
    init();
}, 1000 * 60 * min); // 15 min