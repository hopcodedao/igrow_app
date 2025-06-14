// src/pages/CourseDetail.jsx
import { useParams, Link } from 'react-router-dom';
import useCourse from '../hooks/useCourse';
import { PageNotFound } from './';
import { Footer } from '../components';

function CourseDetail() {
  const { courseId } = useParams();
  const { loading, error, course } = useCourse(courseId);

  if (loading) {
    return <p className="page-heading text-lg">Đang tải chi tiết khóa học...</p>;
  }

  if (error || !course) {
    return <PageNotFound />;
  }

  return (
    <>
      <div className="mx-auto mb-16 flex w-[90%] animate-reveal flex-col">
        {/* --- THAY ĐỔI BẮT ĐẦU TỪ ĐÂY --- */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="page-heading my-0 text-left">{course.title}</h1>
          <Link
            to={`/course/${courseId}/forum`}
            className="fill-button flex-shrink-0 whitespace-nowrap"
          >
            <span className="material-symbols-outlined mr-2">forum</span>
            Vào diễn đàn
          </Link>
        </div>
        {/* --- THAY ĐỔI KẾT THÚC Ở ĐÂY --- */}

        <p className="mt-4 mb-8 text-lg text-gray-700 dark:text-gray-300 md:text-center">
          {course.description}
        </p>

        <div className="mx-auto w-full max-w-4xl space-y-8">
          {course.modules?.map((module, moduleIndex) => (
            <div key={moduleIndex} className="card p-6">
              <h2 className="mb-4 text-2xl font-bold text-primary dark:text-secondary">
                {module.title}
              </h2>
              <ul className="space-y-3">
                {module.lessons?.map((lesson, lessonIndex) => (
                  <li key={lessonIndex} className="flex items-center">
                    <span className="material-symbols-outlined mr-3 text-secondary">school</span>
                    <Link
                      to={`/lesson/${lesson.lessonId}`}
                      className="text-lg font-medium hover:text-primary dark:hover:text-secondary"
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CourseDetail;
