const bcrypt = require("bcryptjs");

exports.seed = function(knex) {
	// Inserts seed entries
	return knex("users").insert([
		{
			username: "example1",
			password: bcrypt.hashSync("pass", 10),
			full_name: "Chad",
			email: "chad@hotmail.com"
		},
		{
			username: "example2",
			password: bcrypt.hashSync("pass", 10),
			full_name: "Carol",
			email: "carol@yahoo.com"
		}
	]);
};
