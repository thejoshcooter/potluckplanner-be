// Update with your config settings.

module.exports = {
	development: {
		client: "sqlite3",
		useNullAsDefault: true,
		connection: {
			filename: "./data/potluck-planner.db3"
		},
		pool: {
			afterCreate: (conn, done) => {
				conn.run("PRAGMA foreign_keys = ON", done);
			}
		},
		migrations: {
			directory: "./data/migrations",
			tableName: "potluck-planner"
		},
		seeds: {
			directory: "./data/seeds"
		}
	},

	// testing: {
	// 	client: "sqlite3",
	// 	useNullAsDefault: true,
	// 	connection: {
	// 		filename: "./data/test.db3"
	// 	},
	// 	pool: {
	// 		afterCreate: (conn, done) => {
	// 			conn.run("PRAGMA foreign_keys = ON", done);
	// 		}
	// 	},
	// 	migrations: {
	// 		directory: "./data/migrations",
	// 		tableName: "test"
	// 	},
	// 	seeds: {
	// 		directory: "./data/seeds"
	// 	}
	// },

	// production: {
	// 	client: "pg",
	// 	connection: process.env.DATABASE_URL || {
	// 		database: "potluck-planner",
	// 		user: "user",
	// 		password: "pass"
	// 	},
	// 	migrations: {
	// 		directory: "./data/migrations",
	// 		tableName: "potluck-planner"
	// 	},
	// 	seeds: {
	// 		directory: "./data/seeds"
	// 	}
	// }
};
