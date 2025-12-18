import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const res = await axios.get(`https://blog-application-backend-zbcq.onrender.com/api/blogs/${id}`);
        setBlog(res.data);

        try {
          const commentsRes = await axios.get(`https://blog-application-backend-zbcq.onrender.com/api/comments/${id}`);
          setComments(commentsRes.data);
        } catch (err) {
          console.error("Error fetching comments:", err);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogAndComments();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`https://blog-application-backend-zbcq.onrender.com/api/blogs/${id}`, { withCredentials: true });
        alert("Blog deleted successfully");
        navigate("/");
      } catch (err) {
        console.error("Error deleting blog:", err);
        alert("Failed to delete blog");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div className="card">
      <h2>{blog.title}</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{blog.content}</p>
      <div className="blog-meta-detail" style={{ margin: "20px 0", fontStyle: "italic", color: "#666" }}>
        <p>By: {blog.author ? blog.author.username : "Unknown"} | Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
      </div>

      {(userRole === "admin" || (blog.author && blog.author._id === userId)) && (
        <button
          onClick={handleDelete}
          className="btn-danger"
          style={{ marginBottom: "20px" }}
        >
          Delete Blog
        </button>
      )}

      <hr style={{ margin: "30px 0", borderTop: "1px solid #eee" }} />

      <h3>Comments</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await axios.post(
              `https://blog-application-backend-zbcq.onrender.com/api/comments/${id}`,
              { content: newComment },
              { withCredentials: true }
            );
            setComments([res.data, ...comments]);
            setNewComment("");
          } catch (err) {
            alert("Failed to add comment. Please log in.");
          }
        }}
        style={{ marginBottom: "30px" }}
      >
        <div className="form-group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
            style={{ height: "80px" }}
          />
        </div>
        <button type="submit" className="btn">Post Comment</button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
            <p>{comment.content}</p>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
              By: {comment.author ? comment.author.username : "Unknown"} on {new Date(comment.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        {comments.length === 0 && <p>No comments yet. Be the first!</p>}
      </div>
    </div>
  );
};

export default BlogDetail;
