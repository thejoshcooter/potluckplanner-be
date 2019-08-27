const router = require("express").Router();

const userDB = require("./userModel");
const eventDB = require("../events/eventModel");
const middleware = require("../middleware");

//GET
router.get("/", async (req, res) => {
	try {
		const users = await userDB.getAll(req.query);
		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The listing of users could not be retrieved."
		});
	}
});

router.get("/:id", middleware.checkUserId, async (req, res) => {
	try {
		const events = await userDB.getByIdEvents(req.params.id);
		if (events.length !== 0) {
			res.status(200).json({ ...req.user, events });
		} else {
			res.status(200).json({
				...req.user,
				events: "There are no events listed for this user"
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The information for the user specified could not be retrieved."
		});
	}
});

router.get("/:id/events", middleware.checkUserId, async (req, res) => {
	try {
		const events = await userDB.getByIdEvents(req.params.id);
		if (events.length !== 0) {
			res.status(200).json(events);
		} else {
			res
				.status(404)
				.json({ message: "There are no events listed for this user." });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The events for the user specified could not be retrieved."
		});
	}
});

//POST
router.post("/:id/events", middleware.checkEvent, async (req, res) => {
	try {
		const event = await eventDB.insert({
			...req.body,
			organizer_id: req.params.id
		});
		const guest = { user_id: req.params.id, attending: true };
		const firstGuest = await eventDB.insertGuest(event.event_id, guest);
		res.status(201).json({ ...event, guests: firstGuest });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "There was an error while adding the event to the database"
		});
	}
});

//DELETE
router.delete("/:id", middleware.checkUserId, async (req, res) => {
	try {
		const count = await userDB.remove(req.params.id);
		if (count !== 0) {
			// res.status(200).json(req.user);
			res.status(200).json(count);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The user could not be removed from the database"
		});
	}
});

//PUT
router.put("/:id", middleware.checkUserId, async (req, res) => {
	try {
		if (!req.body.full_name) {
			res.status(400).json({
				message: "Please provide the desired changes to full_name."
			});
		} else {
			const updated = await userDB.update(req.params.id, req.body.full_name);
			res.status(200).json(updated);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "The user could not be updated in the database"
		});
	}
});

module.exports = router;
