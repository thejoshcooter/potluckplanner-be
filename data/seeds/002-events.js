exports.seed = function(knex) {
	// Inserts seed entries
	return knex("events").insert([
		{
			organizer_id: 1,
			event_name: "Chad's event",
			date: "2019-08-01",
			time: "12:00:00",
			description: "Chad's event",
			address: "100 Elm Street",
			city: "Chadsville",
			state: "Florida"
		},
		{
			organizer_id: 2,
			event_name: "Carol's event",
			date: "2019-07-01",
			time: "11:00:00",
			description: "Carol's event",
			address: "200 Wicker Lane",
			city: "Suburbia",
			state: "Alabama"
		}
	]);
};
