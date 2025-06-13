import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Footer, Thumbnail } from "../components";
import { useData } from "../hooks";
import useGAEventTracker from "../hooks/useGAEventTracker";

// Đổi tên component từ Quizzes thành Courses
function Courses() {
  // Thay đổi Event Tracker cho phù hợp
  const gaEventTracker = useGAEventTracker("Course Thumbnail");

  // Lấy dữ liệu từ "courses" thay vì "topics"
  const { loading, error, data: courses } = useData("courses");
  const [shuffledCourses, setShuffledCourses] = useState([]);

  useEffect(() => {
    if (courses.length > 0) {
      // Bỏ logic lọc theo `noq`, chỉ cần xáo trộn danh sách các khóa học
      const shuffledArray = [...courses].sort(() => Math.random() - 0.5);
      setShuffledCourses(shuffledArray);
    }
  }, [courses]);

  return (
    <>
      <div className="mx-auto mb-32 flex min-h-screen w-[90%] animate-reveal flex-col items-center">
        <h1 className="page-heading">Khám phá các khóa học</h1>
        {shuffledCourses.length > 0 && (
          <div className="mx-auto grid h-full w-full grid-cols-quizzes justify-items-center gap-7">
            {/* Đổi biến `topic` thành `course` cho rõ nghĩa */}
            {shuffledCourses.map((course) => (
              <Link
                key={course.topicID}
                className="w-fit"
                // Cập nhật đường dẫn đến trang chi tiết khóa học
                to={`/course/${course.topicID}`}
                onClick={() => gaEventTracker({ label: course.topicID })}
              >
                {/* Cập nhật các props cho Thumbnail */}
                <Thumbnail
                  id={course.topicID}
                  title={course.title}
                  description={course.description} // Thêm mô tả
                  type="course" // Đổi type thành "course"
                />
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center text-center text-xl">
          {/* Cập nhật lại các thông báo */}
          {!loading && courses.length === 0 && (
            <>Không tìm thấy khóa học nào!</>
          )}
          {error && <>Đã xảy ra lỗi khi tải khóa học!</>}
          {loading && <>Đang tải danh sách khóa học...</>}
        </div>
      </div>
      <Footer />
    </>
  );
}

// Đổi export default
export default Courses;
