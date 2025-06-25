const express = require("express");
const router = express.Router();
const Thread = require("../models/Thread");
const requireAuth = require("../middleware/authMiddleware");

// GET: Home page – list all threads
router.get("/", async (req, res) => {
    const threads = await Thread.find().populate("author").sort({ createdAt: -1 });
    res.render("home", { threads }); // user is available via res.locals.user

});

// GET: Create new thread form
router.get("/thread/new", requireAuth, (req, res) => {
    res.render("create-thread", { user: req.user });
});

// POST: Create new thread
router.post("/thread", requireAuth, async (req, res) => {
    const { title, content } = req.body;
    try {
        const thread = new Thread({
            title,
            content,
            author: req.user._id
        });
        await thread.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.send("Error creating thread");
    }
});

const Post = require("../models/Post");

// View a single thread + its posts
router.get("/thread/:id", async (req, res) => {
    const thread = await Thread.findById(req.params.id).populate("author");
    const posts = await Post.find({ threadId: thread._id }).populate("author").sort({ createdAt: 1 });
    res.render("thread", { thread, posts });
});

// Submit a post under a thread
router.post("/thread/:id/post", requireAuth, async (req, res) => {
    try {
        const newPost = new Post({
            content: req.body.content,
            author: req.user._id,
            threadId: req.params.id,
        });
        await newPost.save();
        res.redirect(`/thread/${req.params.id}`);
    } catch (err) {
        console.error(err);
        res.send("Error adding post");
    }
});

// GET: Edit Thread Form
router.get("/thread/:id/edit", requireAuth, async (req, res) => {
    const thread = await Thread.findById(req.params.id);
    if (!thread || thread.author.toString() !== req.user._id.toString()) {
        return res.status(403).send("Forbidden");
    }
    res.render("edit-thread", { thread });
});

// POST: Update Thread
router.post("/thread/:id/update", requireAuth, async (req, res) => {
    const { title, content } = req.body;
    const thread = await Thread.findById(req.params.id);
    if (thread.author.toString() !== req.user._id.toString()) {
        return res.status(403).send("Forbidden");
    }
    thread.title = title;
    thread.content = content;
    await thread.save();
    res.redirect(`/thread/${thread._id}`);
});

// GET: Delete Thread
router.get("/thread/:id/delete", requireAuth, async (req, res) => {
    const thread = await Thread.findById(req.params.id);
    if (thread.author.toString() !== req.user._id.toString()) {
        return res.status(403).send("Forbidden");
    }
    await thread.deleteOne();
    res.redirect("/");
});

// GET: Edit post form
router.get("/post/:id/edit", requireAuth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).send("Forbidden");
    }
    res.render("edit-post", { post });
});

// POST: Update post
router.post("/post/:id/update", requireAuth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).send("Forbidden");
    }
    post.content = req.body.content;
    await post.save();
    res.redirect(`/thread/${post.threadId}`);
});

// GET: Delete post
router.get("/post/:id/delete", requireAuth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).send("Forbidden");
    }
    const threadId = post.threadId;
    await post.deleteOne();
    res.redirect(`/thread/${threadId}`);
});

const User = require("../models/User");

// GET: Profile page
router.get("/profile", requireAuth, async (req, res) => {
    const user = req.user;
    const threads = await Thread.find({ author: user._id }).sort({ createdAt: -1 });
    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 }).populate("threadId");
    res.render("profile", { user, threads, posts });
});

// POST: Like or Unlike a Post
router.post("/post/:id/like", requireAuth, async (req, res) => {
    const post = await Post.findById(req.params.id);

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
        // Unlike
        post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
        // Like
        post.likes.push(req.user._id);
    }

    await post.save();
    res.redirect(`/thread/${post.threadId}`);
});



module.exports = router;
