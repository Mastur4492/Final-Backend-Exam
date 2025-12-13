const express = require("express");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const auth = require("../middleware/auth");

const router = express.Router();

// 💬 ADD COMMENT
router.post("/:blogId", auth, async (req, res) => {
    try {
        const { content } = req.body;
        const blog = await Blog.findById(req.params.blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const comment = new Comment({
            content,
            blog: req.params.blogId,
            author: req.user,
        });

        await comment.save();
        await comment.populate("author", "username");

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 📜 GET COMMENTS FOR A BLOG
router.get("/:blogId", async (req, res) => {
    try {
        const comments = await Comment.find({ blog: req.params.blogId })
            .populate("author", "username")
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🗑️ DELETE COMMENT (Owner or Admin)
router.delete("/:id", auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Allow deletion if user is author OR user is admin
        if (comment.author.toString() !== req.user && req.role !== "admin") {
            return res.status(401).json({ message: "Not authorized" });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: "Comment removed" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
