// EditPost.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditPost.css";

const CLOUD_NAME = "dxm4vfqeh"; // Cloud name trên Cloudinary dashboard
const UPLOAD_PRESET = "blog_preset"; // Upload preset (unsigned) bạn đã tạo

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("");
  const [post, setPost] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setImage(data.imageUrl);
      })
      .catch((error) => console.log("Error fetching: ", error));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Hiển thị ảnh tạm thời trước (local preview)
      setImage(URL.createObjectURL(file));
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setPost((prevPost) => ({
            ...prevPost,
            imageUrl: data.secure_url,
          }));
          setImage(data.secure_url); // Hiển thị luôn ảnh chính thức sau upload
          setUploading(false);
        })
        .catch(() => {
          alert("Upload lỗi!");
          setUploading(false);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(post);
    fetch(`http://localhost:3000/posts/${id}`, {
      method: "PUT", // Cập nhật bài viết
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json(); // Chắc chắn API trả về JSON
      })
      .then(() => {
        navigate(`/post/${id}`);
      })
      .catch((error) => console.log("Error fetching: ", error));
  };

  return (
    <div className="edit-post-container">
      <h2>Chỉnh sửa bài blog</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            name="title"
            id="title"
            value={post.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Nội dung</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Ảnh</label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            onChange={handleImageChange}
          />
          {image && (
            <div className="image-preview">
              <img src={image} alt="img" />
            </div>
          )}
        </div>
        <button type="submit" disabled={uploading}>
          Submit
        </button>
        {uploading && <span>Đang upload ảnh...</span>}
      </form>
    </div>
  );
};

export default EditPost;
