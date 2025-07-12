import React, { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="home">
      <button className="create-post-btn mb-3">+ Đăng bài</button>
      <div className="post-cards">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h2 className="post-title">{post.title}</h2>
              <div className="post-actions">
                <button className="edit-btn">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="delete-btn">
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div className="post-content">
              <div className="post-image">
                <img
                  src={process.env.PUBLIC_URL + post.imageUrl}
                  alt={post.title}
                />
              </div>
              <p className="post-description">{post.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
