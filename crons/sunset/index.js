var moment = require('moment');

var getAndParseSunsetTime = require('./getAndParseSunsetTime');
var getDB = require('../../db').getConnection;

const GET_DATE_STRING_N_DAYS_FROM_NOW = n => moment().add(n, 'days').format("YYYY-MM-DD")

const DAYS_TO_DO = [0, 30, 375];

const sendResultToDB = conn => r => new Promise((resolve, reject) => {
	console.log(r.moment.format('YYYY-MM-DD HH:mm'))
	conn.execute(
		"insert into sunsets (sunset_datetime) values (to_date(:s,'YYYY-MM-DD HH24:MI'))",
		[r.moment.format('YYYY-MM-DD HH:mm')],
		{ autoCommit: true },
		err => {
			if (err) console.log(err);
			else console.log("inserted!");
		}
	)
});

module.exports = function() {
	return Promise.all([getDB()].concat(DAYS_TO_DO.map(
		d => getAndParseSunsetTime(GET_DATE_STRING_N_DAYS_FROM_NOW(d))
	))).then(connAndResults => {
		var conn = connAndResults.shift();
		return connAndResults.map(sendResultToDB(conn));
	}).catch(err => {
		console.log(err)
	});
};
