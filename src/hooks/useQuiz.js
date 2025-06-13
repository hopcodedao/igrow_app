// src/hooks/useQuiz.js
import { get, getDatabase, orderByKey, query, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { getCourseFromDB, saveCourseToDB } from '../utils/db';

export default function useQuiz(topicID) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quiz, setQuiz] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      setError(false);

      try {
        // Bước 1: Thử lấy dữ liệu từ IndexedDB trước
        const localData = await getCourseFromDB(topicID);
        if (localData) {
          setQuiz(Object.values(localData.questions));
          setLoading(false);
        }

        // Bước 2: Vẫn gọi Firebase để lấy dữ liệu mới nhất
        const db = getDatabase();
        const quizRef = ref(db, `quizzes/${topicID}`);
        const quizQuery = query(quizRef, orderByKey());

        const snapshot = await get(quizQuery);

        if (snapshot.exists()) {
          const remoteData = snapshot.val();

          remoteData.topicID = topicID;
          
          setQuiz(Object.values(remoteData.questions));
          await saveCourseToDB(remoteData);
        } else if (!localData) {
          // Nếu không có cả local và remote data
          setError(true);
        }
      } catch (err) {
        console.error(err);
        if (!quiz.length) setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [topicID]);

  return { loading, error, quiz };
}