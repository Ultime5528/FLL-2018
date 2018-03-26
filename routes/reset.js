var express = require('express');
var router = express.Router();
var r = require('rethinkdb');
var config = require(__dirname + '/../config');
const { exec } = require('child_process');
const moment = require('moment');


router.post('/', function(req, res, next) {
    try {
        console.log('Reset!');
    
        let testData = [];
        console.log('Timezone offset');
        console.log(new Date());
        console.log((new Date()).getTimezoneOffset());
        for(let i = 9; i >= 0; i--) {

            let dateDebut = moment().subtract(i, 'days').local();
            console.log(dateDebut.format('YYYY-MM-DD HH:mm'));
            console.log(dateDebut.toDate());

            for(let j = 1; j <= 2; j++)
                testData.push({
                    capteurId: j,
                    quantite: Math.round( (Math.random() * 19 + 1) * 100) / 100,
                    dateDebut: dateDebut.add(1, 'minutes').toDate(),
                    dateFin: dateDebut.add(1, 'minutes').toDate()
                });

        }


        r.connect(config.rethinkdb)
            .then(conn => r.table('consommation').delete().run(conn));

        r.connect(config.rethinkdb)
            .then(conn => r.table('consommation').insert(testData).run(conn));

    
        let date = moment(req.body.date);
        console.log("sudo date -s '" + date.format('YYYY-MM-DD HH:mm:ss') +"'");
        //exec("sudo date -s '" + date.toDateString() + " " + date.toTimeString().slice(0, 5) + "'");
        //res.json({a: 'a'});
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;