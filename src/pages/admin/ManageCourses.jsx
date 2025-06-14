// src/pages/admin/ManageCourses.jsx
import { Link } from 'react-router-dom';
import { getDatabase, ref, remove } from 'firebase/database';
import { useData, useAlert } from '../../hooks';

function ManageCourses() {
  const { loading, data: courses, error } = useData('courses');

  const handleDelete = async (courseId) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseId}"? Hành động này không thể hoàn tác.`)) {
      try {
        const db = getDatabase();
        const courseRef = ref(db, `courses/${courseId}`);
        await remove(courseRef);
        useAlert('success', 'Xóa khóa học thành công!');
        // Dữ liệu sẽ tự động cập nhật nhờ hook useData
      } catch (err) {
        console.error(err);
        useAlert('error', 'Đã có lỗi xảy ra khi xóa.');
      }
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý Khóa học</h1>
        <Link to="/admin/courses/new" className="fill-button">
          Thêm khóa học
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        {loading && <p>Đang tải...</p>}
        {error && <p className="text-red-500">Lỗi tải dữ liệu.</p>}
        {!loading && (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tiêu đề</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-dark">
              {courses.map(course => (
                <tr key={course.topicID}>
                  <td className="whitespace-nowrap px-6 py-4">{course.title}</td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-sm">{course.topicID}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link to={`/admin/courses/edit/${course.topicID}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">Sửa</Link>
                    <button onClick={() => handleDelete(course.topicID)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageCourses;