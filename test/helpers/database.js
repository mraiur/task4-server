const path = require('path');
const migration = require('./../../src/models/migration');
const db = require('./../../src/helpers/postgres');
const logger = require('./../../src/helpers/logger');
const { QueryFile } = require('pg-promise');

const cleanDBSql = new QueryFile(path.join(__dirname, './../../src/models/sql/migration/clean.sql'));

module.exports.cleanup = async () => {
	await db.none(cleanDBSql).catch((err) => {
		logger.error('DB migration failed', { err });
	});
};

module.exports.populate = async () => {
	await migration(logger);
};

module.exports.close = async () => {
	db.$pool.end();
};