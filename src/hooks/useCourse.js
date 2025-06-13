// src/hooks/useCourse.js
import { get, getDatabase, orderByKey, query, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { getCourseFromDB, saveCourseToDB } from '../utils/db';

export default function useCourse(courseId) { // đổi tên tham số cho rõ nghĩa
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [course, setCourse] = useState(null); // đổi tên state

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      setError(false);

      try {
        const localData = await getCourseFromDB(courseId);
        if (localData) {
          setCourse(localData);
          setLoading(false);
        }

        // Thay đổi đường dẫn tại đây
        const db = getDatabase();
        const courseRef = ref(db, `courses/${courseId}`);
        const courseQuery = query(courseRef, orderByKey());

        const snapshot = await get(courseQuery);

        if (snapshot.exists()) {
          const remoteData = snapshot.val();
          remoteData.topicID = courseId; // Vẫn dùng topicID vì keyPath trong DB là vậy
          setCourse(remoteData);
          await saveCourseToDB(remoteData);
        } else if (!localData) {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        if (!course) setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
        fetchCourse();
    }
  }, [courseId]);

  return { loading, error, course };
}