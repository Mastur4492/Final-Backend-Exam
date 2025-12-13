import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { title, content } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/blogs", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="card">
      <h2>Add New Blog</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn">
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
