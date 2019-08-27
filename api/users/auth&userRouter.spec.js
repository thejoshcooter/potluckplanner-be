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

	describe("register", () => {
		it("should return 201 for adding user", () => {
			const user = {
				username: "user",
				password: "pass",
				full_name: "full_name",
				email: "email"
			};

			return request(server)
				.post(`/users/register`)
				.send(user)
				.then(res => {
					expect(res.status).toBe(201);
				});
		});

		it("should return 400 for empty body", () => {
			const blank = {};

			return request(server)
				.post(`/users/register`)
				.send(blank)
				.then(res => {
					expect(res.status).toBe(400);
				});
		});

		it("should return 401 for duplicate username", () => {
			const duplicate = {
				username: "user",
				password: "pass",
				full_name: "full_name",
				email: "email"
			};

			return request(server)
				.post(`/users/register`)
				.send(duplicate)
				.then(res => {
					expect(res.status).toBe(401);
				});
		});
	});

	describe("login", () => {
		it("should return 401 for invalid credentials", async () => {
			const wrongLog = {
				username: "user",
				password: "pass1"
			};

			return request(server)
				.post(`/users/login`)
				.send(wrongLog)
				.then(res => {
					expect(res.status).toBe(401);
				});
		});

		it("should return 200 for logging in", async () => {
			const userLog = {
				username: "user",
				password: "pass"
			};

			return request(server)
				.post(`/users/login`)
				.send(userLog)
				.then(res => {
					expect(res.status).toBe(200);
					token = res.body.token;
				});
		});
	});

	describe("get all users", () => {
		it("should return 200 for retrieving all users", () => {
			return request(server)
				.get(`/users/`)
				.set("authorization", token)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("get user by id", () => {
		it("should return 200 for retrieving the first user", () => {
			return request(server)
				.get(`/users/1`)
				.set("authorization", token)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("create a new event", () => {
		it("should return 200 for creating an event for the first user", () => {
			const event = {
				event_name: "New Event",
				date: "2019-01-31",
				time: "11:00:00",
				description: "test",
				address: "123 street",
				city: "test",
				state: "test"
			};

			return request(server)
				.post(`/users/1/events`)
				.set("authorization", token)
				.send(event)
				.then(res => {
					expect(res.status).toBe(201);
				});
		});
	});

	describe("get events by user id", () => {
		it("should return 200 for retrieving the events for the first user", () => {
			return request(server)
				.get(`/users/1/events`)
				.set("authorization", token)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("update user info", () => {
		it("should return 200 for updating user info", () => {
			return request(server)
				.put(`/users/1`)
				.set("authorization", token)
				.send({ full_name: "updated" })
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});

	describe("delete user", () => {
		it("should return 200 for deleting user info", () => {
			return request(server)
				.delete(`/users/1`)
				.set("authorization", token)
				.then(res => {
					expect(res.status).toBe(200);
				});
		});
	});
});
