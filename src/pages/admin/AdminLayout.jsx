// src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';

function AdminLayout() {
  const navLinkClasses = ({ isActive }) =>
    `block rounded-lg px-4 py-2 text-lg transition-colors hover:bg-primary hover:text-white ${
      isActive ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300'
    }`;

  return (
    <div className="mx-auto flex w-[95%] max-w-7xl animate-reveal gap-8 py-8">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 md:block">
        <div className="card sticky top-24 p-4">
          <h2 className="mb-4 text-xl font-bold">Menu Quản trị</h2>
          <nav className="space-y-2">
            <NavLink to="/admin" end className={navLinkClasses}>
              Bảng điều khiển
            </NavLink>
            <NavLink to="/admin/courses" className={navLinkClasses}>
              Quản lý Khóa học
            </NavLink>


            
            {/* <NavLink to="/admin/mentors" className={navLinkClasses}>
              Quản lý Cố vấn
            </NavLink> */}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet /> {/* Các trang con của admin sẽ được hiển thị ở đây */}
      </main>
    </div>
  );
}

export default AdminLayout;