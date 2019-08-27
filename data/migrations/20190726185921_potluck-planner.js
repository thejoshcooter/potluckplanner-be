exports.up = function(knex) {
	return knex.schema
		.createTable("users", users => {
			users.increments("user_id");
			users
				.string("username")
				.notNullable()
				.unique();
			users.string("password").notNullable();
			users.string("full_name").notNullable();
			users.string("email").notNullable();
		})
		.createTable("events", events => {
			events.increments("event_id");
			events
				.integer("organizer_id")
				.unsigned()
				.notNullable()
				.references("user_id")
				.inTable("users")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			events.string("event_name").notNullable();
			events.date("date").notNullable();
			events.time("time").notNullable();
			events.string("description").notNullable();
			events.string("address").notNullable();
			events.string("city").notNullable();
			events.string("state").notNullable();
		})
		.createTable("guests", guests => {
			guests.increments("guest_id");
			guests
				.integer("user_id")
				.unsigned()
				.notNullable()
				.references("user_id")
				.inTable("users")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			guests
				.integer("event_id")
				.unsigned()
				.notNullable()
				.references("event_id")
				.inTable("events")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			guests
				.boolean("attending")
				.notNullable()
				.defaultTo(false);
		})
		.createTable("recipes", recipes => {
			recipes.increments("recipe_id");
			recipes
				.integer("event_id")
				.unsigned()
				.notNullable()
				.references("event_id")
				.inTable("events")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
			recipes.string("recipe_name").notNullable();
			recipes
				.integer("user_id")
				.unsigned()
				.references("user_id")
				.inTable("users")
				.onDelete("CASCADE")
				.onUpdate("CASCADE");
		});
};

exports.down = function(knex) {
	return knex.schema
		.dropTableIfExists("users")
		.dropTableIfExists("events")
		.dropTableIfExists("guests")
		.dropTableIfExists("recipes");
};
