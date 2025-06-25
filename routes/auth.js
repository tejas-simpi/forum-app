const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// GET: Register page
router.get("/register", (req, res) => {
    res.render("register");
});

// POST: Register new user
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed });
        await user.save();
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.send("Error during registration");
    }
});

// GET: Login page
router.get("/login", (req, res) => {
    res.render("login");
});

// POST: Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.send("Invalid credentials");

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.send("Invalid credentials");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Login failed");
    }
});

// GET: Logout
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

module.exports = router;
