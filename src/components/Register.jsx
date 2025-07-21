import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu trùng khớp
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp.");
      return;
    }

    // Lấy danh sách user hiện tại để kiểm tra trùng username
    const res = await fetch("http://localhost:3000/user");
    const users = await res.json();
    const userExists = users.find((u) => u.username === formData.username);
    if (userExists) {
      setMessage("❌ Tên đăng nhập đã tồn tại.");
      return;
    }

    // Gửi dữ liệu lên server
    const newUser = {
      username: formData.username,
      password: formData.password,
    };

    await fetch("http://localhost:3000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    setMessage("✅ Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Đăng ký</h2>

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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Đăng ký</button>
        {message && <p className="message">{message}</p>}

        <p className="login-link">
          Đã có tài khoản?{" "}
          <a>
            <Link to="/login">Đăng nhập</Link>
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
