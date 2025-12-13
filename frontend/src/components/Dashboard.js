import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs/myblogs", {
          // headers: { Authorization: `Bearer ${token}` }, // Handled by cookie
        });
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          // headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (blog) => {
    setEditing(blog._id);
    setEditTitle(blog.title);
    setEditContent(blog.content);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        {
          title: editTitle,
          content: editContent,
        }
      );
      setBlogs(blogs.map((blog) => (blog._id === id ? response.data : blog)));
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setEditTitle("");
    setEditContent("");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ margin: "0", fontSize: "28px", fontWeight: "600" }}>
          My Dashboard
        </h2>
        <Link to="/add-blog" className="btn">
          Add New Blog
        </Link>
      </div>

      <h3 style={{ marginBottom: "25px", fontSize: "22px", color: "#333333" }}>
        My Blogs
      </h3>
      {blogs.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "60px 30px" }}
        >
          <h3 style={{ marginBottom: "15px" }}>No blogs yet</h3>
          <p style={{ color: "#666666", marginBottom: "20px" }}>
            Start creating your first blog post!
          </p>
          <Link to="/add-blog" className="btn">
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="cards-container">
          {blogs.map((blog) => (
            <div key={blog._id} className="card">
              {editing === blog._id ? (
                <div>
                  <div className="form-group">
                    <label>Title:</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Blog title"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #cccccc",
                        borderRadius: "6px",
                        fontSize: "16px",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Content:</label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Blog content"
                      rows="8"
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #cccccc",
                        borderRadius: "6px",
                        fontSize: "16px",
                        resize: "vertical",
                      }}
                    />
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleUpdate(blog._id)}
                      className="btn"
                    >
                      Update Blog
                    </button>
                    <button onClick={handleCancel} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3>{blog.title}</h3>
                  <div className="blog-content">{blog.content}</div>
                  <div className="blog-meta">
                    <span className="blog-author">
                      By: {blog.author ? blog.author.username : "Unknown"}
                    </span>
                    <span className="blog-date">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="card-actions">
                    <Link to={`/blog/${blog._id}`} className="btn">
                      View Full Post
                    </Link>
                    <button
                      onClick={() => handleEdit(blog)}
                      className="btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
};

export default Dashboard;
