// src/pages/Lesson.jsx

import _ from "lodash";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageNotFound } from ".";
import { AnswerBox, ProgressBar, Rules } from "../components";
import { useAuth } from "../contexts/AuthContext";
// Đổi tên hook cho phù hợp
import useLessonData from "../hooks/useLessonData"; 
import { saveProgressToDB } from '../utils/db';

const initialState = null;

const reducer = (state, action) => {
  switch (action.type) {
    // 'lesson' thay cho 'quiz'
    case "lesson": { 
      if (!action.value || !action.value.questions) return [];
      const qnaSet = _.cloneDeep(action.value.questions);
      qnaSet.forEach((question) => {
        question.options.forEach((option) => {
          option.checked = false;
        });
      });
      return qnaSet;
    }
    case "answer": {
      const questions = _.cloneDeep(state);
      questions[action.questionID].options[action.optionIndex].checked =
        action.value;
      return questions;
    }
    default:
      return state;
  }
};

// Đổi tên component
function Lesson() { 
  const { lessonId } = useParams(); // Lấy lessonId từ URL
  // Sử dụng hook mới để lấy dữ liệu bài học
  const { loading, error, lesson } = useLessonData(lessonId); 
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [qnaSet, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const date = useMemo(() => new Date(), []);
  const [answerSelected, setAnswerSelected] = useState(false);

  useEffect(() => {
    dispatch({
      type: "lesson",
      value: lesson,
    });
  }, [lesson]);

  const handleAnswerChange = useCallback(
    (e, index) => {
      dispatch({
        type: "answer",
        questionID: currentQuestion,
        optionIndex: index,
        value: e.target.checked,
      });
      setAnswerSelected(true);
    },
    [dispatch, currentQuestion]
  );
  
  const onAnswerSelected = (e, index) => {
    handleAnswerChange(e, index);
  };
  
  const nextQuestion = useCallback(() => {
    if (answerSelected && qnaSet && currentQuestion < qnaSet.length - 1) {
      setCurrentQuestion((curr) => curr + 1);
    }
    setAnswerSelected(false);
  }, [currentQuestion, qnaSet, answerSelected]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion >= 1)
      setCurrentQuestion((curr) => curr - 1);
  }, [currentQuestion]);

  const progressPercentage =
    qnaSet?.length > 0 ? ((currentQuestion + 1) * 100) / qnaSet.length : 0;

  const completeLesson = useCallback(async () => {
    // ... (logic getMarkSheet giữ nguyên)
    function getMarkSheet() {
      let correctAnswersCount = 0;
      let incorrectAnswersCount = 0;
      let unattemptedCount = 0;

      qnaSet?.forEach((question) => {
        const correctIndexes = [];
        const checkedIndexes = [];

        question.options.forEach((option, index2) => {
          if (option.correct) correctIndexes.push(index2);
          if (option.checked) checkedIndexes.push(index2);
        });

        if (checkedIndexes.length === 0) unattemptedCount += 1;
        else if (_.isEqual(correctIndexes, checkedIndexes))
          correctAnswersCount += 1;
        else incorrectAnswersCount += 1;
      });

      const noq = qnaSet?.length;
      const obtainedPoints =
        correctAnswersCount * 10 - incorrectAnswersCount * 2;
      const obtainedPercentage = noq > 0 ? (obtainedPoints / (noq * 10)) * 100 : 0;

      return [
        noq,
        correctAnswersCount,
        incorrectAnswersCount,
        unattemptedCount,
        obtainedPoints,
        obtainedPercentage,
      ];
    }
    const [
        noq,
        correctAnswersCount,
        incorrectAnswersCount,
        unattemptedCount,
        obtainedPoints,
        obtainedPercentage,
      ] = getMarkSheet();
  
      const markSheetObject = {
        userId: currentUser.uid,
        topicId: lesson.topicId || lessonId, // Lấy topicId từ lesson nếu có
        lessonId: lessonId,
        date: date.toLocaleDateString("en-IN"),
        time: `${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, "0")} ${
            date.getHours() < 12 ? "AM" : "PM"
          }`,
        noq: noq,
        correctAnswersCount: correctAnswersCount,
        incorrectAnswersCount: incorrectAnswersCount,
        unattemptedCount: unattemptedCount,
        obtainedPoints: obtainedPoints,
        obtainedPercentage: obtainedPercentage,
        qnaSet: { ...qnaSet },
      };
  
      try {
          await saveProgressToDB(markSheetObject);
          navigate(`/result/${lessonId}`, { state: { qnaSet, markSheetObject } });
      } catch (error) {
          console.error("Lỗi khi lưu bài học:", error);
      }
  }, [currentUser, date, lesson, lessonId, navigate, qnaSet]);

  // Kiểm tra nếu bài học không có câu hỏi
  const noQuestions = !qnaSet || qnaSet.length === 0;

  return (
    <>
      {loading && <p className="page-heading text-lg">Đang tải bài học...</p>}
      {error && <PageNotFound />}
      {!loading && !error && lesson && (
        <div className="mx-auto w-[85%] animate-reveal">
          <h1 className="page-heading">{lesson.title}</h1>
          
          {/* Hiển thị nội dung lý thuyết của bài học */}
          {lesson.content && (
              <div className="card mb-8 p-6 text-justify">
                  <p className="text-lg leading-relaxed">{lesson.content}</p>
              </div>
          )}

          {/* Chỉ hiển thị phần câu hỏi nếu có */}
          {!noQuestions && (
            <>
              <h2 className="page-heading my-4 text-3xl">Kiểm tra kiến thức</h2>
              <Rules />
              <div className="card mb-40 flex flex-col justify-center rounded-md p-3">
                <div className="flex flex-col items-center justify-center text-xl font-bold text-black dark:text-white sm:text-3xl">
                  {qnaSet[currentQuestion].title}
                  {qnaSet[currentQuestion].image && (
                    <img
                      src={qnaSet[currentQuestion].image}
                      alt="Minh họa Câu hỏi"
                      className="my-4 max-h-64 object-contain"
                    />
                  )}
                </div>

                <hr className="mb-8 mt-3 h-px border-0 bg-primary" />

                <AnswerBox
                  input
                  handleChange={onAnswerSelected}
                  options={qnaSet[currentQuestion].options}
                />
              </div>

              <ProgressBar
                nextQ={nextQuestion}
                prevQ={previousQuestion}
                progress={progressPercentage}
                submit={completeLesson}
              />
            </>
          )}

          {/* Nếu bài học không có câu hỏi, có thể hiển thị nút "Hoàn thành" */}
          {noQuestions && (
              <div className="flex justify-center">
                  <button onClick={() => navigate('/courses')} className="fill-button mt-8">
                      Quay lại danh sách
                  </button>
              </div>
          )}
        </div>
      )}
    </>
  );
}

export default Lesson;