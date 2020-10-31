const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../data/config");

const router = express.Router();

router.post("/api/register", async (req, res) => {
  try {
    const { username, password, department } = req.body;

    const user = await db("users").where({ username }).first();

    if (user) {
      res.status(409).json({
        message: "Username is already taken",
      });
    }

    const hash = bcrypt.hashSync(password, 14);

    const id = await db("users").insert({
      username,
      password: hash,
      department,
    });

    res.status(201).json(await db("users").where({ id }).first());
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db("users").where({ username }).first();

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userID: user.id,
        userDepartment: user.department,
      },
      process.env.JWT_SECRET || "this is a very secret secret"
    );

    res.json({
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "yo you messed up" });
  }
});

router.get("/api/users", async (req, res) => {
  try {
    const users = await db("users");
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
