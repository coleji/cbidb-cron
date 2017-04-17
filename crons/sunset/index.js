var getAndParseSunsetTime = require('./getAndParseSunsetTime');

module.exports = function() {
	return getAndParseSunsetTime('today').then(sunsetMoment => {
		console.log("RESPONSE ", resString)
	}).catch(err => {
		console.log(err)
	});
};
