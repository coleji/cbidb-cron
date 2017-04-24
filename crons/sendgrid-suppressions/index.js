var ini = require('ini');
var fs = require('fs');
var https = require('https');

const querySendgrid = (endpoint, start, end) => new Promise((resolve, reject) => {
	const iniData = ini.parse(fs.readFileSync('./crons/sendgrid-suppressions/ini/private.ini', 'utf-8')).sendgridApi;
	var options = {
		hostname : iniData.hostname,
		path : iniData.path + endpoint + "?start_time=" + start + "&end_time=" + end + "&limit=500&offset=0",
		headers : {
			"Authorization" : iniData.authHeader,
			"Content-Type" : "application/json"
		}
	}

	var req = https.request(options, function(res) {
		var resData = '';
		res.on('data', (chunk) => {
			resData += chunk;
		});
		res.on('end', () => {
			var response = JSON.parse(resData);
			resolve(resData);
		});
	});

	req.on('error', function(e) {
		reject("error with sendgrid req: " + e);
	})

	req.end();
});

module.exports = () => {
	querySendgrid('blocks', 1485227230, 1485227230).then(res => {
		console.log(res)
	})
}
