var express = require('express');
var router = express.Router();
var r = require('rethinkdb');
var config = require(__dirname + '/../config');
const { exec } = require('child_process');

router.post('/', function(req, res, next) {
    console.log('Reset!');
  r.connect(config.rethinkdb)
    .then(conn => r.table('consommation').delete().run(conn));

    try {

    //let date = JSON.parse(req.body.date);
    console.log(req.body);
    console.log('sudo date -s ' + date.toDateString() + " " + date.toTimeString().slice(0, 5));
    //exec('sudo date -s ' + date.toDateString() + " " + date.toTimeString().slice(0, 5));
    res.json({a: 'a'});
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;