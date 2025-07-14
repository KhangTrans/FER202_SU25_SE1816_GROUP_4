import React, { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  const [home, setHome] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [postsPerPage] = useState(3); // Số lượng bài viết mỗi trang

  // Tính tổng số trang
  const totalPages = Math.ceil(home.length / postsPerPage);

  useEffect(() => {
    fetch("http://localhost:3000/home")
      .then((response) => response.json())
      .then((data) => setHome(data));
  }, []);

  // Chuyển đến trang tiếp theo hoặc trang trước
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Tính toán chỉ mục bài viết trên trang hiện tại
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = home.slice(indexOfFirstPost, indexOfLastPost);

  const handleShowMore = (id) => {
    setHome((prevHome) =>
      prevHome.map((item) =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  return (
    <div className="home">
      {currentPosts.map((homepage) => (
        <div key={homepage.id}>
          <h1 className="mt-3 title">{homepage.title}</h1>
          <div className="row container mt-5">
            <div className="col-md-6">
              <img
                src={homepage.images}
                alt={homepage.title}
                className="img-fluid"
              />
            </div>
            <div className="col-md-6">
              {/* Hiển thị HTML đúng cách */}
              <p>
                {homepage.isExpanded ? (
                  <span dangerouslySetInnerHTML={{ __html: homepage.content }} />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: homepage.content.substring(0, 300) }} />
                )}
                <button
                  className="btn btn-link"
                  onClick={() => handleShowMore(homepage.id)}
                >
                  {homepage.isExpanded ? "Ẩn bớt" : "Xem thêm"}
                </button>
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Phân trang */}
      <div className="pagination">
        <button
          className="btn btn-link"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          className="btn btn-link"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Home;
