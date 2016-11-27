var express = require('express');
var request = require('request');

var app = express();

app.use(express.static(__dirname + '/src', {redirect: false}));

app.use('/proxy', function (req, res) {
    var url = req.url.replace('/?url=', '');
    req.pipe(request(url)).pipe(res);
});

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.redirect('/node');
});

app.get('/:req', function (req, res) {
    res.sendfile('src/air-quality-mk.html');
});


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

