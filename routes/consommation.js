var express = require('express');
var router = express.Router();
var r = require('rethinkdb');
var config = require(__dirname + '/../config')

/* GET users listing. */
router.get('/', function(req, res, next) {
  r.connect(config.rethinkdb).then(conn => {
    return r.table('consommation').orderBy({index: 'dateDebut'}).run(conn);
  }).then(cursor => {
    return cursor.toArray();
  }).then(result => {
    res.json(result);
  }).error(err => {
    console.log(err);
  })

});

module.exports = router;
