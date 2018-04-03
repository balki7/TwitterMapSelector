const express = require('express');
const path = require('path');
const dataCollector = require('./data_collector/get');
const app = express();

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    res.redirect('/search.html');
});

app.get('/search', function (req, res) {
    res.redirect('/search.html');
});

app.get('/get', function (req, res) {
    res.redirect('/get.html');
});

app.get('/searchTweets', function (req, res) {
    dataCollector.get(req.query.filter, (content) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(content));
    }, (err) => {
        console.error(err.stack)
        res.status(500).send(JSON.stringify(err))
    });
});

app.listen(9001, () => console.log('App listening on port 9001!'))

