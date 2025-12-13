const express = require("express");
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔍 GET MY BLOGS
router.get("/myblogs", auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({ title, content, author: req.user });
    await blog.save();
    await blog.populate("author", "username");
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.author.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const { title, content } = req.body;
    blog.title = title;
    blog.content = content;
    await blog.save();
    await blog.populate("author", "username");
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // Check if user is author or admin
    console.log("Delete Request Debug:");
    console.log("Req User:", req.user);
    console.log("Req Role:", req.role);
    console.log("Blog Author:", blog.author.toString());

    if (blog.author.toString() !== req.user && req.role !== "admin") {
      console.log("Authorization Failed");
      return res.status(401).json({ message: "Not authorized" });
    }

    await Blog.deleteOne({ _id: req.params.id });
    console.log("Database Delete Executed for ID:", req.params.id);

    res.json({ message: "Blog removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
