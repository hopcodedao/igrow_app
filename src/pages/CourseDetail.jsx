// src/pages/CourseDetail.jsx
import { useParams, Link } from 'react-router-dom';
import useCourse from '../hooks/useCourse';
import { PageNotFound } from './';
import { Footer } from '../components';
import AccordionModule from '../components/common/AccordionModule';

function CourseDetail() {
  const { courseId } = useParams();
  const { loading, error, course } = useCourse(courseId);

  if (loading) {
    return <p className="page-heading text-lg">Đang tải chi tiết khóa học...</p>;
  }

  if (error || !course) {
    return <PageNotFound />;
  }

  const totalLessons = course.modules?.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0
  );

  const firstLessonId = course.modules?.[0]?.lessons?.[0]?.lessonId;

  return (
    <>
      <div className="mx-auto mb-16 w-[90%] animate-reveal">
        {/* Ảnh bìa khóa học */}
        <div className="relative mb-8 h-48 md:h-64 overflow-hidden rounded-lg">
          <img
            src={course.thumbnail || '/placeholder.webp'}
            alt={`Ảnh bìa của khóa học ${course.title}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <h1 className="absolute bottom-4 left-4 text-3xl md:text-5xl font-bold text-white">
            {course.title}
          </h1>
        </div>

        {/* Nội dung chính và thanh bên */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Nội dung chính */}
          <div className="w-full md:w-2/3">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-primary dark:text-secondary">
                Nội dung khóa học
              </h2>
              <Link
                to={`/course/${courseId}/forum`}
                className="fill-button flex-shrink-0 whitespace-nowrap"
              >
                <span className="material-symbols-outlined mr-2">forum</span>
                Vào diễn đàn
              </Link>
            </div>

            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
              {course.description}
            </p>

            {course.modules?.map((module, moduleIndex) => (
              <AccordionModule key={moduleIndex} module={module} />
            ))}
          </div>

          {/* Thanh bên */}
          <aside className="w-full md:w-1/3">
            <div className="card sticky top-24 p-6">
              <h3 className="text-xl font-bold mb-4">Thông tin khóa học</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="material-symbols-outlined mr-3 text-secondary">
                    collections_bookmark
                  </span>
                  {course.modules?.length || 0} chương
                </li>
                <li className="flex items-center">
                  <span className="material-symbols-outlined mr-3 text-secondary">
                    play_lesson
                  </span>
                  {totalLessons} bài học
                </li>
              </ul>

              {firstLessonId && (
                <Link
                  to={`/lesson/${firstLessonId}`}
                  className="fill-button mt-6 w-full text-center"
                >
                  Bắt đầu học
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CourseDetail;
