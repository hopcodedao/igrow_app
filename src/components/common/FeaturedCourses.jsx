// src/components/common/PopularQuizzes.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Thumbnail } from '..';
// Sử dụng hook useData chung, không dùng usePopularQuizzes nữa
import { useData } from '../../hooks'; 

// Đổi tên component cho phù hợp với chức năng mới
function FeaturedCourses() { 
  // Lấy danh sách TẤT CẢ các khóa học
  const { loading, error, data: courses } = useData('courses');
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    // Khi có dữ liệu khóa học, lấy 4 khóa học đầu tiên để làm nổi bật
    if (courses && courses.length > 0) {
      setFeatured(courses.slice(0, 4));
    }
  }, [courses]);

  // Nếu đang tải hoặc không có khóa học nào, không hiển thị gì cả
  if (loading || error || featured.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto my-24 flex w-full flex-col justify-center">
      <p className="mx-auto mb-14 w-[90%] text-center text-4xl font-bold uppercase tracking-wider lg:text-5xl">
        Các khóa học nổi bật
      </p>
      <div className="mx-auto grid w-[85%] grid-cols-1 place-items-center gap-x-10 gap-y-16 xl:grid-cols-2 2xl:grid-cols-4">
        {featured.map((course) => (
          <Link
            key={course.topicID}
            className="w-full max-w-[500px]"
            to={`/course/${course.topicID}`} // Liên kết đến trang chi tiết khóa học
          >
            <Thumbnail
              id={course.topicID}
              title={course.title}
              description={course.description}
              type="course" // Sử dụng type 'course'
              image={course.thumbnail}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

// Export component với tên mới
export default FeaturedCourses;