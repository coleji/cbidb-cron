var promisedotseq = require("promisedotseq");
var moment = require("moment");

var getDB = require("../../db").getConnection;

module.exports = (type, results) => {
	var connection;
	if (results.length == 0) return Promise.resolve();
	else return getDB().then(c => {
		connection = c
	}, err => {
		console.log("Error getting db connection: " + err);
	}).then(() => promisedotseq(results.map(row => () => new Promise((resolve, reject) => {
		var {cols, values}  = (function() {
			var cols = [];
			var values = { type };
			for (var field in row) {
				var newField = (field == "created") ? "occurred_datetime" : field;
				cols.push(newField);
				values[newField] = (field == "created") ? moment(row[field] * 1000).toDate() : row[field];
			}
			return {cols, values};
		}());
		connection.execute(
			"insert into sendgrid_suppression_activity(type, " + cols.join(", ") + ") values (:type, " + cols.map(c => ':' + c).join(', ') + ")",
			values,
			{autoCommit: true},
			(err, result) => {
				if (err) reject(err);
				else resolve(result);
			}
		)
	})))).catch(err => {
		console.log("Error: " + err)
	}).then(() => {
		connection.close();
	})
}
