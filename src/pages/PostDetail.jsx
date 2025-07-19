import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnonymousComment from "../components/AnonymousComment";
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("DATA POST DETAIL:", data);
                setPost(data);
            });
    }, [id]);

    if (!post || Object.keys(post).length === 0) {
        return <div>Không tìm thấy bài viết!</div>;
    }

    return (
        <div className="post-detail-container">
            {/* ============================ */}
            {/* 📝 Container: Phần Bài Viết */}
            {/* ============================ */}
            <div className="blog-container">
                <div className="post-detail-content">
                    <img
                        src={`${post.imageUrl}`}
                        alt={post.title}
                        className="post-detail-image"
                    />
                    <div className="post-detail-text">
                        <h2 className="post-title-detail">{post.title}</h2>
                        <p className="post-content-detail">{post.content}</p>
                        {post.postDetail && (
                            <div className="post-detail-box">{post.postDetail}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* ============================ */}
            {/* 💬 Container: Phần Bình Luận */}
            {/* ============================ */}
            <div className="comment-container">
                <AnonymousComment postId={post.id} />
            </div>
        </div>
    );
};

export default PostDetail;
