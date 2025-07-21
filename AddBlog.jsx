import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AddBlog.css";

const CLOUD_NAME = "dxm4vfqeh"; // Cloud name trên Cloudinary dashboard
const UPLOAD_PRESET = "blog_preset"; // Upload preset (unsigned) bạn đã tạo

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
    imageUrl: '',
    postDetail: '',
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [message, setMessage] = useState('');
  const [existingTags, setExistingTags] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/posts')
      .then(response => response.json())
      .then(data => {
        const tagSet = new Set();
        data.forEach(post => {
          if (post.tags) {
            post.tags.forEach(tag => tagSet.add(tag));
          }
        });
        setExistingTags(Array.from(tagSet));
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnonymousChange = (e) => {
    setIsAnonymous(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({ ...prev, author: 'Ẩn danh' }));
    } else {
      setFormData((prev) => ({ ...prev, author: '' }));
    }
  };

  const handleAddSuggestedTag = (tag) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
    if (!currentTags.includes(tag)) {
      const newTagsString = [...currentTags, tag].join(', ');
      setFormData(prev => ({ ...prev, tags: newTagsString }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Hiển thị ảnh tạm thời trước (local preview)
      setPreviewImage(URL.createObjectURL(file));
      setUploading(true);

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("upload_preset", UPLOAD_PRESET);

      fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: uploadFormData,
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            imageUrl: data.secure_url,
          }));
          setPreviewImage(data.secure_url); // Hiển thị luôn ảnh chính thức sau upload
          setUploading(false);
        })
        .catch(() => {
          alert("Upload lỗi!");
          setUploading(false);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPost = {
      title: formData.title,
      content: formData.content,
      author: formData.author,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      createdAt: new Date().toISOString().split('T')[0],
      imageUrl: formData.imageUrl,
      postDetail: formData.postDetail,
    };

    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then(() => {
        setMessage('Tạo bài viết thành công!');
        setTimeout(() => {
          navigate('/');
        }, 2000); // Chuyển hướng sau 2 giây để hiển thị thông báo
      })
      .catch((error) => {
        console.error('Error adding post:', error);
        setMessage('Có lỗi xảy ra khi tạo bài viết.');
      });
  };

  return (
    <div className="add-blog">
      <h2>Tạo Bài Viết</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-left">
          <div className="form-group">
            <label>Tiêu đề:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nội dung ngắn:</label>
            <input
              type="text"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tác giả:</label>
            <div className="author-options">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={handleAnonymousChange}
              />
              <label htmlFor="anonymous">Ẩn danh</label>
            </div>
            {!isAnonymous && (
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                required={!isAnonymous}
              />
            )}
          </div>
          <div className="form-group">
            <label>Tag:</label>
            <div className="tags-container">
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Nhập tags, phân cách bằng dấu phẩy"
              />
              <span className="dropdown-arrow">▼</span>
            </div>
            {existingTags.length > 0 && (
              <div className="suggested-tags">
                {existingTags.map((tag) => (
                  <span
                    key={tag}
                    className="tag-suggestion"
                    onClick={() => handleAddSuggestedTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Hình ảnh:</label>
            <div className="file-upload">
              <input
                type="file"
                name="imageUrl"
                onChange={handleImageChange}
                required={!formData.imageUrl}
                id="file-input"
              />
              <label htmlFor="file-input" className="file-label">file</label>
            </div>
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Preview" />
              </div>
            )}
          </div>
        </div>
        <div className="form-right">
          <div className="form-group">
            <label>Chi tiết bài viết:</label>
            <textarea
              name="postDetail"
              value={formData.postDetail}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-btn" disabled={uploading}>Đăng Bài</button>
          {uploading && <span>Đang upload ảnh...</span>}
        </div>
      </form>
      {message && <div className="success-message">{message}</div>}
    </div>
  )
}

export default AddBlog;