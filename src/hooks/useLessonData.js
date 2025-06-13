// src/hooks/useLessonData.js
import { get, getDatabase, ref } from 'firebase/database';
import { useEffect, useState } from 'react';

// Ta không cần logic offline ở đây vì dữ liệu bài học có thể đã được
// tải về cùng với toàn bộ khóa học.
export default function useLessonData(lessonId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    async function fetchLesson() {
      setLoading(true);
      setError(false);
      try {
        const db = getDatabase();
        const lessonRef = ref(db, `lessons/${lessonId}`);
        const snapshot = await get(lessonRef);
        if (snapshot.exists()) {
          setLesson(snapshot.val());
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  return { loading, error, lesson };
}