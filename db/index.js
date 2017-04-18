var oracledb = require('oracledb');
var fs = require('fs');
var ini = require('ini');

var connectionOptions = ini.parse(fs.readFileSync('./ini/private.ini', 'utf-8')).dbCredentials;

const getConnection = function() {
	return new Promise((resolve, reject) => {
		oracledb.getConnection(connectionOptions, (err, conn) => {
			if (err) reject(err);
			else resolve(conn);
		});
	});
};

module.exports = {
	getConnection
};
