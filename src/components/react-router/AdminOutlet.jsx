// src/components/react-router/AdminOutlet.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../hooks';
import useUserData from '../../hooks/useUserData'; // Hook để lấy dữ liệu người dùng

function AdminOutlet() {
  const { currentUser } = useAuth();
  // Lấy dữ liệu chi tiết của người dùng hiện tại từ /users/{uid}
  const { userData, loading } = useUserData(currentUser?.uid);

  if (loading) {
    return <p className="page-heading">Đang kiểm tra quyền truy cập...</p>;
  }

  // Nếu người dùng không phải admin, chuyển hướng về trang chủ
  if (!userData || userData.role !== 'admin') {
    useAlert('error', 'Bạn không có quyền truy cập vào trang này!');
    return <Navigate to="/" />;
  }

  // Nếu là admin, cho phép truy cập
  return <Outlet />;
}

export default AdminOutlet;