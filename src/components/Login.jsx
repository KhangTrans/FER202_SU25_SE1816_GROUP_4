import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 
import "./Login.css"; // Đổi tên file CSS nếu cần

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); 
  useEffect(() => {
    fetch("http://localhost:3000/user")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Lỗi khi tải users.json:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundUser = users.find(
      (user) =>
        user.username === formData.username &&
        user.password === formData.password
    );

    if (foundUser) {
      setMessage(`Đăng nhập thành công!`);
      localStorage.setItem("user", JSON.stringify(foundUser));
       setTimeout(() => {
        navigate("/"); // ✅ chuyển về trang chủ
      }, 1000); // chờ 1 giây để hiện thông báo rồi mới chuyển
    } else {
      setMessage("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>

        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Đăng nhập</button>

        {message && <p className="message">{message}</p>}

        <p className="signup-link">
          Bạn chưa có tài khoản? <a href="/">
          <Link to="/register">
            Đăng ký
          </Link></a>
        </p>
      </form>
    </div>
  );
};

export default Login;
