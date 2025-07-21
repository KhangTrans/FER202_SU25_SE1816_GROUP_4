import React, { useEffect, useState } from "react";
import { format } from "date-fns";

const AnonymousComment = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState("");
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyName, setReplyName] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/comments?postId=${postId}`)
            .then(res => res.json())
            .then(data => {
                setComments(data.reverse());
                setLoading(false);
            });
    }, [postId]);

    const handleAddComment = (parentId = null) => {
        const text = parentId ? replyContent : content;
        if (!text.trim()) return;

        const commentName = parentId
            ? replyName.trim() || "Ẩn danh"
            : name.trim() || "Ẩn danh";

        const newComment = {
            postId,
            parentId,
            name: commentName,
            content: text,
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
                if (parentId) {
                    setReplyContent("");
                    setReplyName("");
                    setActiveReplyId(null);
                } else {
                    setContent("");
                    setName("");
                }
            });
    };


    const rootComments = comments.filter(c => !c.parentId);
    const getReplies = (parentId) =>
        comments.filter(c => c.parentId === parentId);

    const renderCommentTree = (comment) => (
        <li key={comment.id} className="comment-item">
            <div className="comment-meta">
                <span className="comment-name">{comment.name}</span>
                <span className="comment-time">{comment.time}</span>
            </div>
            <div className="comment-content">{comment.content}</div>
            <button
                className="comment-reply-btn"
                onClick={() => {
                    setActiveReplyId(comment.id);
                    setReplyContent(`@${comment.name} `);
                }}
            >
                Trả lời
            </button>

            {activeReplyId === comment.id && (
                <div className="comment-reply-box">
                    <input
                        className="name-input"
                        placeholder="Tên khi trả lời (mặc định: Ẩn danh)"
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        style={{ marginBottom: 8 }}
                    />
                    <textarea
                        className="comment-input"
                        placeholder="Nhập trả lời..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <button
                        className="comment-btn"
                        onClick={() => handleAddComment(comment.id)}
                    >
                        Gửi trả lời
                    </button>
                    <button
                        className="comment-cancel-btn"
                        onClick={() => {
                            setActiveReplyId(null);
                            setReplyContent("");
                            setReplyName("");
                        }}
                    >
                        Huỷ
                    </button>
                </div>
            )}

            <ul className="comment-reply-list">
                {getReplies(comment.id).map(child => renderCommentTree(child))}
            </ul>
        </li>
    );

    return (
        <div className="comment-wrap">
            <div className="comment-title">Bình luận</div>

            {/* 🆕 Container chia 2 cột */}
            <div className="comment-layout">
                {/* 🆕 Left: Form gửi bình luận */}
                <div className="comment-form-wrap">
                    <input
                        className="name-input"
                        placeholder="Tên (mặc định: Ẩn danh)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginBottom: 8 }}
                    />
                    <textarea
                        className="comment-input"
                        placeholder="Nhập bình luận của bạn..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button
                        className="comment-btn"
                        onClick={() => handleAddComment()}
                    >
                        Gửi bình luận
                    </button>
                </div>

                {/* 🆕 Right: List bình luận */}
                <div className="comment-list-wrap">
                    {loading ? (
                        <div style={{ color: "#999", marginTop: 10 }}>Đang tải bình luận...</div>
                    ) : (
                        <ul className="comment-list">
                            {rootComments.length === 0 && (
                                <li style={{ color: "#888", marginBottom: 8, fontStyle: "italic" }}>
                                    Chưa có bình luận nào
                                </li>
                            )}
                            {rootComments.map(comment => renderCommentTree(comment))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnonymousComment;
