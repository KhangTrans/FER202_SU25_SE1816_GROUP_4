import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Blogs from "./pages/Blogs";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import { useState } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar setSearchQuery={setSearchQuery} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blogs searchQuery={searchQuery} />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;