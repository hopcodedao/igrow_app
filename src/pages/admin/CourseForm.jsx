// src/pages/admin/CourseForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDatabase, ref, set, get } from "firebase/database";
import { useAlert } from "../../hooks";

const initialCourseState = {
  topicID: "",
  title: "",
  description: "",
  thumbnail: "",
  modules: [],
};

function CourseForm() {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const navigate = useNavigate();
  const isEditMode = Boolean(courseId); // Kiểm tra xem đây là chế độ Sửa hay Thêm mới

  const [courseData, setCourseData] = useState(initialCourseState);
  const [loading, setLoading] = useState(false);

  // Nếu là chế độ Sửa, tải dữ liệu của khóa học
  useEffect(() => {
    if (isEditMode) {
      const db = getDatabase();
      const courseRef = ref(db, `courses/${courseId}`);
      get(courseRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Chuyển đổi modules thành chuỗi JSON để dễ chỉnh sửa trong textarea
          setCourseData({
            ...data,
            modules: JSON.stringify(data.modules || [], null, 2),
          });
        } else {
          useAlert("error", "Không tìm thấy khóa học.");
          navigate("/admin/courses");
        }
      });
    }
  }, [courseId, isEditMode, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const db = getDatabase();
      // Lấy ID từ form state, đảm bảo không có khoảng trắng hoặc ký tự đặc biệt
      const finalId = courseData.topicID.trim().toLowerCase();
      if (!finalId) {
        useAlert("error", "ID khóa học là bắt buộc.");
        setLoading(false);
        return;
      }

      const finalData = { ...courseData };
      // Chuyển đổi chuỗi JSON modules trở lại thành object trước khi lưu
      try {
        finalData.modules = JSON.parse(courseData.modules);
      } catch (jsonError) {
        useAlert("error", "Cấu trúc JSON của modules không hợp lệ.");
        setLoading(false);
        return;
      }

      const courseRef = ref(db, `courses/${finalId}`);
      await set(courseRef, finalData);

      useAlert(
        "success",
        `Đã ${isEditMode ? "cập nhật" : "tạo mới"} khóa học thành công!`
      );
      navigate("/admin/courses");
    } catch (error) {
      console.error("Lỗi khi lưu khóa học:", error);
      useAlert("error", "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Chỉnh sửa Khóa học" : "Tạo Khóa học mới"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topicID" className="mb-2 block font-semibold">
            ID Khóa học (slug)
          </label>
          <input
            id="topicID"
            name="topicID"
            value={courseData.topicID}
            onChange={handleInputChange}
            placeholder="vd: khoa-hoc-ky-nang-so"
            className="w-full rounded-md border p-3 dark:bg-dark"
            required
            disabled={isEditMode} // Không cho sửa ID ở chế độ edit
          />
          {isEditMode && (
            <small className="text-gray-500">
              Không thể thay đổi ID của khóa học đã tồn tại.
            </small>
          )}
        </div>
        <div>
          <label htmlFor="title" className="mb-2 block font-semibold">
            Tiêu đề
          </label>
          <input
            id="title"
            name="title"
            value={courseData.title}
            onChange={handleInputChange}
            placeholder="Tiêu đề của khóa học"
            className="w-full rounded-md border p-3 dark:bg-dark"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="mb-2 block font-semibold">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            className="w-full rounded-md border p-3 dark:bg-dark"
            rows="4"
          />
        </div>
        <div>
          <label htmlFor="thumbnail" className="mb-2 block font-semibold">
            URL Ảnh bìa (Thumbnail)
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            value={courseData.thumbnail}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-md border p-3 dark:bg-dark"
          />
        </div>
        <div>
          <label htmlFor="modules" className="mb-2 block font-semibold">
            Cấu trúc Modules và Lessons (JSON)
          </label>
          <textarea
            id="modules"
            name="modules"
            value={courseData.modules}
            onChange={handleInputChange}
            className="w-full rounded-md border p-3 font-mono text-sm dark:bg-dark"
            rows="15"
            placeholder="Dán cấu trúc JSON của bạn vào đây..."
          />
          <small className="text-gray-500">
            Chỉnh sửa cấu trúc khóa học trực tiếp dưới dạng JSON. Hãy cẩn thận
            với cú pháp.
          </small>
        </div>
        <div className="flex justify-end gap-4">
          <Link
            to="/admin/courses"
            className="border-button rounded-lg px-6 py-2"
          >
            Hủy
          </Link>
          <button
            type="submit"
            className="fill-button px-6 py-2"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu Khóa học"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;
