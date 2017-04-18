var fs = require('fs');
var ini = require('ini');
var http = require('http');
var moment = require('moment-timezone');

const SUNSET_CONFIG = ini.parse(fs.readFileSync('./crons/sunset/ini/private.ini', 'utf-8'));

// takes a 'YYYY-MM-DD' string
// queries remote api to get sunset time on that date
// return {dateString : initial arg, }
module.exports = function(dateString) {
	return new Promise((resolve, reject) => {
		const PATH = (function() {
			var params = (function() {
				var result = [];
				for (var param in SUNSET_CONFIG.params) result.push(param + '=' + SUNSET_CONFIG.params[param]);
				result.push('date=' + dateString);
				return result.join('&');
			}());
			return [SUNSET_CONFIG.apiEndpoint.path].concat(params).join('?');
		}());

		var options = {
			host : SUNSET_CONFIG.apiEndpoint.host,
			path : PATH
		};

		var req = http.request(options, (res) => {
			var resData = '';
			res.on('data', (chunk) => {
				resData += chunk;
			});
			res.on('end', () => {
				var response = JSON.parse(resData);
				if (response.status != 'OK') reject("api status was " + response.status);
				else resolve({
					dateString,
					moment: moment(response.results.sunset).tz('America/New_York')
				});
			});
		});
		req.on('error', (e) => {
			reject(e);
		});

		req.end();

		console.log(options);
	});
};
