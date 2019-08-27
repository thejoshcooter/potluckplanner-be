const db = require("../../data/db-config");
const mappers = require("../mappers");

module.exports = {
	getAll: function() {
		return db("events");
	},

	getById: function(id) {
		return db("events")
			.where("event_id", id)
			.first();
	},

	getByIdGuests: function(id) {
		return db("events as e")
			.join("guests as g", "g.event_id", "e.event_id")
			.join("users as u", "u.user_id", "g.user_id")
			.where("e.event_id", id)
			.select("u.user_id", "u.full_name", "g.attending")
			.orderBy("u.user_id")
			.then(guests =>
				guests ? guests.map(guest => mappers.displayTrueFalse(guest)) : null
			);
	},

	getByIdRecipes: function(id) {
		return db("recipes as r")
			.join("events as e", "r.event_id", "e.event_id")
			.leftJoin("users as u", "u.user_id", "r.user_id")
			.where("e.event_id", id)
			.select("r.recipe_name", "u.user_id", "u.full_name")
			.orderBy("r.recipe_name");
	},

	insert: function(event) {
		return db("events")
			.insert(event, "event_id")
			.then(([id]) => this.getById(id).first());
	},

	insertGuest: function(event_id, guest) {
		return db("guests")
			.insert({
				event_id,
				user_id: guest.user_id,
				attending: guest.attending
			})
			.returning()
			.then(() => this.getByIdGuests(event_id));
	},

	insertRecipe: function(event_id, recipe) {
		return db("recipes")
			.insert({
				event_id,
				recipe_name: recipe.recipe_name
			})
			.returning()
			.then(() => this.getByIdRecipes(event_id));
	},

	update: function(id, changes) {
		return db("events")
			.where("event_id", id)
			.update(changes)
			.orderBy("event_id")
			.then(count => (count !== 0 ? this.getAll() : null));
		// .then(count => (count !== 0 ? this.getById(id) : null));
	},

	updateGuest: function(event_id, user_id, changes) {
		return db("guests")
			.where({ event_id, user_id })
			.returning()
			.update(changes)
			.then(count => (count !== 0 ? this.getByIdGuests(event_id) : null));
	},

	updateRecipe: function(event_id, changes) {
		return db("recipes")
			.where({ event_id, recipe_name: changes.recipe_name })
			.update(changes)
			.then(count => (count !== 0 ? this.getByIdRecipes(event_id) : null));
	},

	remove: function(id) {
		return db("events")
			.where("event_id", id)
			.del()
			.then(() => this.getAll());
	},

	removeGuest: function(event_id, user_id) {
		return db("guests")
			.where({ event_id, user_id })
			.del();
	},

	removeRecipe: function(event_id, recipe_name) {
		return db("recipes")
			.where({ event_id, recipe_name })
			.del();
	}
};
