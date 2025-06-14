// src/pages/Lesson.jsx

import _ from "lodash";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { PageNotFound } from ".";
import { AnswerBox, ProgressBar, Rules, AITutorModal } from "../components";
import { useAuth } from "../contexts/AuthContext";
import useLessonData from "../hooks/useLessonData";
import { saveProgressToDB } from "../utils/db";
import { checkAndAwardBadges } from "../utils/gamification";
import successSound from "../assets/success.mp3";

const initialState = [];

const reducer = (state, action) => {
  switch (action.type) {
    case "questions": {
      if (!action.value) return [];
      const qnaSet = _.cloneDeep(action.value);
      qnaSet.forEach((question) => {
        question.options.forEach((option) => {
          option.checked = false;
        });
      });
      return qnaSet;
    }
    case "answer": {
      const questions = _.cloneDeep(state);
      const currentQ = questions[action.questionID];

      // Kiểm tra xem tùy chọn đã nhấp có đang được chọn hay không
      const isAlreadyChecked = currentQ.options[action.optionIndex].checked;

      // Bỏ chọn tất cả các tùy chọn cho câu hỏi hiện tại
      currentQ.options.forEach((option) => {
        option.checked = false;
      });

      // Nếu tùy chọn đã nhấp chưa được chọn, hãy chọn nó
      if (!isAlreadyChecked) {
        currentQ.options[action.optionIndex].checked = true;
      }
      // Nếu nó đã được chọn, nó sẽ bị bỏ chọn (đã tắt)

      return questions;
    }
    default:
      return state;
  }
};

function Lesson() {
  const { lessonId } = useParams();
  const { loading, error, lesson } = useLessonData(lessonId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [qnaSet, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const date = useMemo(() => new Date(), []);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  const successAudio = useMemo(() => new Audio(successSound), []);

  useEffect(() => {
    if (lesson && lesson.questions) {
      dispatch({
        type: "questions",
        value: lesson.questions,
      });
    }
  }, [lesson]);

  // handleAnswerChange đã được sửa đổi để chỉ nhận chỉ mục
  const handleAnswerChange = useCallback(
    (index) => {
      dispatch({
        type: "answer",
        questionID: currentQuestion,
        optionIndex: index,
      });
    },
    [currentQuestion]
  );

  const onAnswerSelected = (index) => {
    // Đổi tên từ e, index thành chỉ index
    handleAnswerChange(index);
  };

  const nextQuestion = useCallback(() => {
    const currentQData = qnaSet[currentQuestion];
    // Kiểm tra trực tiếp từ qnaSet xem có tùy chọn nào được chọn không
    const isAnyOptionChecked = currentQData?.options.some(
      (option) => option.checked
    );

    if (isAnyOptionChecked && currentQuestion < qnaSet.length - 1) {
      successAudio
        .play()
        .catch((e) => console.error("Error playing sound:", e));
      setCurrentQuestion((curr) => curr + 1);
    }
  }, [currentQuestion, qnaSet, successAudio]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion >= 1) setCurrentQuestion((curr) => curr - 1);
  }, [currentQuestion]);

  const progressPercentage =
    qnaSet?.length > 0 ? ((currentQuestion + 1) * 100) / qnaSet.length : 0;

  const completeLesson = useCallback(async () => {
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
      const obtainedPercentage =
        noq > 0 ? (obtainedPoints / (noq * 10)) * 100 : 0;
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
      topicId: lesson.topicId || lessonId,
      topicTitle: lesson.title, // ✅ THÊM topicTitle
      lessonId,
      date: date.toLocaleDateString("en-IN"),
      time: `${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, "0")} ${date.getHours() < 12 ? "AM" : "PM"}`,
      noq,
      correctAnswersCount,
      incorrectAnswersCount,
      unattemptedCount,
      obtainedPoints,
      obtainedPercentage,
      qnaSet: { ...qnaSet },
    };

    try {
      await saveProgressToDB(markSheetObject);
      await checkAndAwardBadges(currentUser.uid, markSheetObject);
      navigate(`/result/${lessonId}`, {
        state: {
          qnaSet,
          markSheetObject,
          topicTitle: lesson.title, // ✅ TRUYỀN topicTitle qua state
        },
      });
    } catch (err) {
      console.error("Lỗi khi lưu bài học:", err);
    }
  }, [currentUser, date, lesson, lessonId, navigate, qnaSet]);

  const noQuestions = !qnaSet || qnaSet.length === 0;

  return (
    <>
      {/* Nút Trợ lý AI nổi */}
      <button
        onClick={() => setIsTutorOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 md:bottom-6"
        title="Hỏi đáp với Trợ lý AI"
      >
        <span className="material-symbols-outlined text-3xl">forum</span>
      </button>

      {/* Modal Trợ lý AI */}
      {lesson && (
        <AITutorModal
          isOpen={isTutorOpen}
          onClose={() => setIsTutorOpen(false)}
          initialContext={lesson.title}
        />
      )}

      {loading && <p className="page-heading text-lg">Đang tải bài học...</p>}
      {error && <PageNotFound />}
      {!loading && !error && lesson && (
        <div className="mx-auto mb-20 w-[85%] animate-reveal">
          <h1 className="page-heading">{lesson.title}</h1>

          {lesson.content && (
            <div className="card prose prose-lg dark:prose-invert mx-auto mb-12 max-w-4xl p-6 text-justify leading-relaxed">
              <p>{lesson.content}</p>
            </div>
          )}

          {!noQuestions ? (
            <>
              <h2 className="page-heading my-4 text-3xl">Kiểm tra kiến thức</h2>
              <Rules />
              <div className="card mb-40 flex flex-col justify-center rounded-md p-3">
                <div className="flex flex-col items-center justify-center text-xl font-bold text-black dark:text-white sm:text-3xl">
                  {qnaSet[currentQuestion]?.title}
                  {qnaSet[currentQuestion]?.image && (
                    <img
                      src={qnaSet[currentQuestion].image}
                      alt="Minh họa"
                      className="my-4 max-h-64 object-contain"
                    />
                  )}
                </div>
                <hr className="mb-8 mt-3 h-px border-0 bg-primary" />
                {/* Truyền các tùy chọn của câu hỏi hiện tại và trình xử lý đã sửa đổi */}
                {qnaSet[currentQuestion] && (
                  <AnswerBox
                    handleChange={onAnswerSelected}
                    options={qnaSet[currentQuestion].options}
                  />
                )}
              </div>
              <ProgressBar
                nextQ={nextQuestion}
                prevQ={previousQuestion}
                progress={progressPercentage}
                submit={completeLesson}
              />
            </>
          ) : (
            <div className="flex justify-center">
              <Link to="/courses" className="fill-button mt-8">
                Quay lại danh sách khóa học
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Lesson;
