var moment = require('moment');

var getAndParseSunsetTime = require('./getAndParseSunsetTime');
var getDB = require('../../db').getConnection;

const GET_DATE_STRING_N_DAYS_FROM_NOW = n => moment().add(n, 'days').format("YYYY-MM-DD")

const DAYS_TO_DO = [30, 375];

const sendResultToDB = conn => r => new Promise((resolve, reject) => {
	conn.execute("insert into sunsets (sunset_datetime) values (:s)", ['2017-01-01'], err => {
		if (err) console.log(err);
	})
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
