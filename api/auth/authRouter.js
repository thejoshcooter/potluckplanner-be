const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets");

const userDB = require("../users/userModel");
const middleware = require("../middleware");

router.post("/register", async (req, res) => {
	try {
		const hash = bcrypt.hashSync(req.body.password, 10);
		req.body.password = hash;
		const user = await userDB.insert(req.body);
		res.status(201).json(user);
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ error: "Something went wrong during registration.", error });
	}
});

router.post("/login", middleware.checkUserLogin, async (req, res) => {
	try {
		let { username, password } = req.body;
		const user = username ? await userDB.getByUsername(username) : null;
		if (user && bcrypt.compareSync(password, user.password)) {
			const token = generateToken(user);
			res.status(200).json({
				message: `Welcome ${user.username}!`,
				token,
				user_id: user.user_id
			});
		} else {
			res.status(401).json({ message: "Invalid Credentials" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Something went wrong." });
	}
});

function generateToken(user) {
	const jwtPayload = {
		subject: user.id,
		username: user.username,
		full_name: user.full_name
	};

	const jwtOptions = {
		expiresIn: "1d"
	};

	return jwt.sign(jwtPayload, secrets.jwtSecret, jwtOptions);
}

module.exports = router;
