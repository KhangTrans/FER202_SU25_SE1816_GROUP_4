import React, { useEffect, useState } from "react";

const AnonymousComment = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    // Load comments từ server theo postId
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/comments?postId=${postId}`)
            .then(res => res.json())
            .then(data => {
                setComments(data.reverse()); // mới nhất lên trên
                setLoading(false);
            });
    }, [postId]);

    const handleAddComment = () => {
        if (!content.trim()) return;
        const commentName = name.trim() || "Ẩn danh";
        const newComment = {
            postId,
            name: commentName,
            content,
            time: new Date().toLocaleString()
        };
        fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newComment)
        })
            .then(res => res.json())
            .then(added => {
                setComments([added, ...comments]);
                setContent("");
                setName("");
            });
    };

    return (
        <div className="anonymous-comments-wrap">
            <div className="anon-comment-title">Bình luận</div>
            <input
                className="anon-comment-input"
                placeholder="Tên (mặc định: Ẩn danh)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: 8 }}
            />
            <textarea
                className="anon-comment-input"
                placeholder="Nhập bình luận của bạn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button className="anon-comment-btn" onClick={handleAddComment}>
                Gửi bình luận
            </button>
            {loading ? (
                <div style={{ color: "#999", marginTop: 10 }}>Đang tải bình luận...</div>
            ) : (
                <ul className="anon-comment-list">
                    {comments.length === 0 && (
                        <li style={{ color: "#888", marginBottom: 8, fontStyle: "italic" }}>
                            Chưa có bình luận nào
                        </li>
                    )}
                    {comments.map((c) => (
                        <li key={c.id} className="anon-comment-item">
                            <div className="anon-comment-meta">
                                <span className="anon-comment-name">{c.name}</span>
                                <span className="anon-comment-time">{c.time}</span>
                            </div>
                            <div className="anon-comment-content">{c.content}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnonymousComment;
