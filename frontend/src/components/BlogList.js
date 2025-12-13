import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BlogList = ({ isAuthenticated }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "30px", fontSize: "28px", fontWeight: "600" }}>
        All Blogs
      </h2>
      {blogs.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "60px 30px" }}
        >
          <h3 style={{ marginBottom: "15px" }}>No blogs found</h3>
          <p style={{ color: "#666666", marginBottom: "0" }}>
            Be the first to create a blog post!
          </p>
        </div>
      ) : (
        <div className="cards-container">
          {blogs.map((blog) => (
            <div key={blog._id} className="card">
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
                  Read More
                </Link>
                {localStorage.getItem("userRole") === "admin" && (
                  <button
                    onClick={async () => {
                      if (window.confirm("Admin Action: Delete this blog?")) {
                        try {
                          await axios.delete(
                            `http://localhost:5000/api/blogs/${blog._id}`,
                            { withCredentials: true }
                          );
                          setBlogs(blogs.filter((b) => b._id !== blog._id));
                          alert("Admin Delete Success");
                        } catch (err) {
                          console.error(err);
                          alert("Failed to delete");
                        }
                      }
                    }}
                    className="btn-danger"
                  >
                    Delete (Admin)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
