// src/pages/CourseDetail.jsx
import { useParams, Link } from 'react-router-dom';
import useCourse from '../hooks/useCourse'; // Import hook mới
import { PageNotFound } from './';
import { Footer } from '../components';

function CourseDetail() {
  const { courseId } = useParams(); // Lấy ID của khóa học từ URL
  const { loading, error, course } = useCourse(courseId);

  if (loading) {
    return <p className="page-heading text-lg">Đang tải chi tiết khóa học...</p>;
  }

  if (error || !course) {
    return <PageNotFound />;
  }

  return (
    <>
        <div className="mx-auto mb-32 flex w-[90%] animate-reveal flex-col">
            <h1 className="page-heading">{course.title}</h1>
            <p className="-mt-8 mb-12 text-center text-lg text-gray-700 dark:text-gray-300">
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
                                <span className="material-symbols-outlined mr-3 text-secondary">
                                school
                                </span>
                                {/* Link đến bài học chi tiết - sẽ làm ở bước sau */}
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