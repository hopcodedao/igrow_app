import { NavLink } from 'react-router-dom';

import { NavButton } from '..';

function SubNavigationBar({ className }) {
  return (
    <ul className={`items-center gap-8 ${className}`}>
      <NavLink className={({ isActive }) => (isActive ? 'active-page' : null)} to="/">
        <NavButton text="Trang chủ" />
      </NavLink>
      <NavLink className={({ isActive }) => (isActive ? 'active-page' : null)} to="/quizzes">
        <NavButton text="Thi trắc nghiệm" />
      </NavLink>
      <NavLink className={({ isActive }) => (isActive ? 'active-page' : null)} to="/learn">
        <NavButton text="Videos" />
      </NavLink>
      <NavLink className={({ isActive }) => (isActive ? 'active-page' : null)} to="/chat-ai">
        <NavButton text="CHAT AI" />
      </NavLink>
      <NavLink className={({ isActive }) => (isActive ? 'active-page' : null)} to="/about">
        <NavButton text="Giới thiệu" />
      </NavLink>
    </ul>
  );
}

export default SubNavigationBar;
