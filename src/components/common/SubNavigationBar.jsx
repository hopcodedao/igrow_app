import { NavLink } from "react-router-dom";
import { NavButton } from "..";
import { useState } from "react";

function SubNavigationBar({ className }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Hàm để xử lý khi chọn danh mục
  const handleLinkClick = () => {
    if (isOpen) {
      toggleMenu(); // Đóng menu nếu nó đang mở
    }
  };

  return (
    <nav className={`relative ${className}`}>
      <button className="md:hidden ml-auto mr-4" onClick={toggleMenu}>
        <span className="material-icons">menu</span>
      </button>
      <ul
        className={`md:flex ${isOpen ? "block" : "hidden"} absolute bg-white md:static top-10 left-0 right-0 z-10`}
      >
        <NavLink
          className={({ isActive }) => (isActive ? "active-page" : null)}
          to="/"
          onClick={handleLinkClick}
        >
          <NavButton text="Trang chủ" />
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active-page" : null)}
          to="/courses"
          onClick={handleLinkClick}
        >
          <NavButton text="Khóa học" />
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active-page" : null)}
          to="/learn"
          onClick={handleLinkClick}
        >
          <NavButton text="Thư viện" />
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active-page" : null)}
          to="/chat-ai"
          onClick={handleLinkClick}
        >
          <NavButton text="CHAT AI" />
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active-page" : null)}
          to="/mentors"
          onClick={handleLinkClick}
        >
          <NavButton text="Cố vấn" />
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "active-page" : null)}
          to="/about"
          onClick={handleLinkClick}
        >
          <NavButton text="Giới thiệu" />
        </NavLink>
      </ul>
    </nav>
  );
}

export default SubNavigationBar;
