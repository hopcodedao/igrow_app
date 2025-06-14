import { useState } from 'react';
import { Link } from 'react-router-dom';

function AccordionModule({ module }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <h2 className="text-xl font-bold text-primary dark:text-secondary">
          {module.title}
        </h2>
        <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <ul className="space-y-3 border-t pt-4 dark:border-gray-700">
            {module.lessons?.map((lesson) => (
              <li key={lesson.lessonId} className="flex items-center">
                <span className="material-symbols-outlined mr-3 text-secondary">school</span>
                <Link
                  to={`/lesson/${lesson.lessonId}`}
                  className="font-medium hover:text-primary dark:hover:text-secondary"
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AccordionModule;
