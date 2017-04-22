var moment = require('moment');
var promiseSequence = require("promisedotseq");

var getAndParseSunsetTime = require('./getAndParseSunsetTime');

const ADD_DAYS_AND_PRINT = (moment, days) => moment.add(days, 'days').format("YYYY-MM-DD");

// I originally intended this as a cron but its really not anymore.
// Run this function with an array of years and it will get the sunset time for each day of each of those years
// and print all the times to the console in YYYY-MM-DD HH24:MI format
// Does not currently do any database I/O although that could be added later.
// Seems easy enough to do a bazillion years worth of sunset times now and just stow them all.
module.exports = function(yearsToDo) {
	const daysToDo = yearsToDo.reduce((days, year) => {
		var day = moment(year + "-01-01");
		while(day.format("YYYY") == year) {
			days.push(day.format("YYYY-MM-DD"))
			day.add(1, 'days');
		}
		return days;
	}, []);

	const promisesFactories = daysToDo.map(d => () => getAndParseSunsetTime(d))

	promiseSequence(promisesFactories).then(results => {
		results.forEach(result => {
			console.log(result.moment.format("YYYY-MM-DD HH:mm"))
		})
	})
};
