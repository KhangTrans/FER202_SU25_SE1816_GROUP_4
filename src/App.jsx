import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Blogs from "./pages/Blogs";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
// Bọc bên trong component để dùng được useLocation
const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        {/*Dùng LocationWrapper để đảm bảo useLocation hợp lệ */}
        <RoutesWrapper
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </BrowserRouter>
    </div>
  );
};

// Tách phần Routes + useLocation vào đây (bên trong BrowserRouter)
const RoutesWrapper = ({ searchQuery, setSearchQuery }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  return (
    <>
      {!isLoginPage && !isRegisterPage && <NavBar setSearchQuery={setSearchQuery} />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog"
          element={
            <ProtectedRoute>
              <Blogs searchQuery={searchQuery} />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>

      {!isLoginPage && !isRegisterPage && <Footer />}
    </>
  );
};

export default App;
