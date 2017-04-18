var sunset = require('./crons/sunset');

sunset();

/*
var db = require("./db");

db.getConnection().then(conn => {
	conn.execute("select * from boat_types", (err, result) => {
		console.log(result)
	})
})
*/

var moment = require('moment-timezone');

var s = '2017-04-15T23:26:34+00:00';

var d = moment(s).tz('America/New_York');

// console.log(d);
