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
            <div className="post-back-btn-wrap">
                <button className="post-back-btn" onClick={() => navigate(-1)}>
                    Quay lại
                </button>
            </div>
            <h2 className="post-title-detail">{post.title}</h2>
            <img src={`${post.imageUrl}`} alt={post.title} className="post-detail-image" />

            <p className="post-content-detail">{post.content}</p>

            {post.postDetail && (
                <div className="post-detail-box">{post.postDetail}</div>
            )}

            <AnonymousComment postId={post.id} />
        </div>
    );
};

export default PostDetail;
