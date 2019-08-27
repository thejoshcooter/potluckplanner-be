const request = require("supertest");
const db = require("../../data/db-config");
const server = require("../server");

describe("routes", () => {
	let token;

	beforeAll(async () => {
		await db("users")
			.truncate()
			.then(function() {
				return db("events")
					.truncate()
					.then(function() {
						return db("guests")
							.truncate()
							.then(function() {
								return db("recipes").truncate();
							});
					});
			});
	});

	describe("setup", () => {
		it("register", () => {
			const user = {
				username: "user1",
				password: "pass1",
				full_name: "full_name1",
				email: "email1"
			};

			return request(server)
				.post(`/users/register`)
				.send(user);
		});

		it("register 2nd user", () => {
			const user2 = {
				username: "user2",
				password: "pass2",
				full_name: "full_name2",
				email: "email2"
			};

			return request(server)
				.post(`/users/register`)
				.send(user2);
		});

		it("login", () => {
			const userLog = {
				username: "user1",
				password: "pass1"
			};

			return request(server)
				.post(`/users/login`)
				.send(userLog)
				.then(res => {
					token = res.body.token;
				});
		});

		it("create first event", () => {
			const event = {
				event_name: "Newer Event",
				date: "2019-03-31",
				time: "12:00:00",
				description: "test2",
				address: "1234 street",
				city: "test2",
				state: "test2"
			};

			return request(server)
				.post(`/users/2/events`)
				.set("authorization", token)
				.send(event);
		});

		it("create second event", () => {
			const event = {
				event_name: "Newest Event",
				date: "2019-05-31",
				time: "10:00:00",
				description: "test3",
				address: "12345 street",
				city: "test3",
				state: "test3"
			};

			return request(server)
				.post(`/users/2/events`)
				.set("authorization", token)
				.send(event);
		});
	});

	describe("get all events", () => {
		it("should return 200 for retrieving all events", () => {
			return request(server)
				.get(`/events/`)
				.set("authorization", token)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("get event by id", () => {
		it("should return 200 for retrieving the second event", () => {
			return request(server)
				.get(`/events/2`)
				.set("authorization", token)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("create a guest for an event", () => {
		it("should return 201 for adding a guest for the second event", () => {
			const guest = {
				user_id: 3,
				attending: false
			};

			return request(server)
				.post(`/events/2/guests`)
				.set("authorization", token)
				.send(guest)
				.then(res => {
					expect(res.status).toBe(201);
				});
		});
	});

	describe("get guests by event id", () => {
		it("should return 200 for retrieving the guests for the second event", () => {
			return request(server)
				.get(`/events/2/guests`)
				.set("authorization", token)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("create a recipe for an event", () => {
		it("should return 201 for adding a recipe for the second event", () => {
			const recipe = {
				recipe_name: "wine"
			};

			return request(server)
				.post(`/events/2/recipes`)
				.set("authorization", token)
				.send(recipe)
				.then(res => {
					expect(res.status).toBe(201);
				});
		});
	});

	describe("get recipes by event id", () => {
		it("should return 200 for retrieving the recipes for the second event", () => {
			return request(server)
				.get(`/events/2/recipes`)
				.set("authorization", token)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("update event by event id", () => {
		it("should return 200 for updating the second event", () => {
			const changes = {
				event_name: "Newer Event Updated",
				city: "Updated City"
			};
			return request(server)
				.put(`/events/2`)
				.set("authorization", token)
				.send(changes)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("update guests by event id", () => {
		it("should return 200 for updating a guest in the second event", () => {
			const guest = {
				attending: false
			};
			return request(server)
				.put(`/events/2/guests/3`)
				.set("authorization", token)
				.send(guest)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("update recipes by event id", () => {
		it("should return 200 for updating a recipe in the second event", () => {
			const recipe = {
				recipe_name: "wine",
				user_id: 3
			};
			return request(server)
				.put(`/events/2/recipes`)
				.set("authorization", token)
				.send(recipe)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("delete guest by event id", () => {
		it("should return 200 for deleting a guest in the second event", () => {
			const guest = {
				// data: {
				user_id: 2
				// }
			};
			return request(server)
				.delete(`/events/2/guests`)
				.set("authorization", token)
				.send(guest)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("delete recipes by event id", () => {
		it("should return 200 for deleting a recipe in the second event", () => {
			const recipe = {
				// data: {
				recipe_name: "wine"
				// }
			};
			return request(server)
				.delete(`/events/2/recipes`)
				.set("authorization", token)
				.send(recipe)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("delete event by event id", () => {
		it("should return 200 for deleting the second event", () => {
			return request(server)
				.delete(`/events/2`)
				.set("authorization", token)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});
});
