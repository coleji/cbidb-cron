var promisedotseq = require("promisedotseq");
var moment = require("moment");

var querySendgrid = require("./querySendgrid");
var saveToDB = require("./saveToDB");

const dataSets = ["blocks", "bounces", "invalid_emails", "spam_reports"];

module.exports = () => {
	const startDateUnix = moment().subtract(1, 'days').startOf('day').unix();
	const endDateUnix = moment().startOf('day').unix();
	console.log("Current Time is " + moment() + ";  querying from " + startDateUnix + " to " + endDateUnix);
	Promise.all(dataSets.map(dataSet => querySendgrid(dataSet, startDateUnix, endDateUnix)))
	.then(results => Promise.all(results.map(
		(r, i) => saveToDB(dataSets[i], JSON.parse(r))
	))).then(result => {
		console.log("Successfully inserted!")
	}).catch(err => {
		console.log("Error inserting: " + err)
	})
}
