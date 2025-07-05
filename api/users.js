import express from "express";
const router = express.Router();

import bcrypt from "bcrypt";

import { createUser, getUserByUsername } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

const SALT_ROUNDS = 10;

router
  .route("/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await createUser(username, hashedPassword);

      if (!user || !user.id) {
        console.error(error.message);
        return res
          .status(500)
          .send("Internal server error: User not created correctly.");
      }

      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).send("Username already exists.");
      }
      console.error(error.message);
      res.status(500).send("Internal server error.");
    }
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await getUserByUsername(username);

      if (
        !user ||
        typeof user.password !== "string" ||
        user.password.length === 0
      ) {
        return res.status(401).send("Invalid username or password.");
      }

      let passwordMatch = false;

      try {
        passwordMatch = await bcrypt.compare(password, user.password);
      } catch (error) {
        console.error(error.message);
        return res.status(401).send("Invalid username or password.");
      }

      if (!passwordMatch) {
        return res.status(401).send("Invalid username or password.");
      }

      const token = createToken({ id: user.id });
      res.send(token);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error.");
    }
  });

export default router;
