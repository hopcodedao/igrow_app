// src/pages/Quiz.jsx

import _ from "lodash";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PageNotFound } from "./";
import successSound from '../assets/success.mp3';
import { AnswerBox, ProgressBar, Rules } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { useQuiz } from "../hooks";
import { saveProgressToDB } from '../utils/db'; // <-- Nhập hàm lưu tiến độ

const initialState = null;

const reducer = (state, action) => {
  switch (action.type) {
    case "quiz": {
      const qnaSet = _.cloneDeep(action.value);
      qnaSet.forEach((question) => {
        question.options.forEach((option) => {
          option.checked = false;
        });
      });
      return qnaSet;
    }
    case "answer": {
      const question = _.cloneDeep(state);
      question[action.questionID].options[action.optionIndex].checked =
        action.value;
      return question;
    }

    default:
      return state;
  }
};

function Quiz() {
  const { id } = useParams();
  const { loading, error, quiz } = useQuiz(id);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [qnaSet, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const date = useMemo(() => new Date(), []);
  const [answerSelected, setAnswerSelected] = useState(false);

  useEffect(() => {
    dispatch({
      type: "quiz",
      value: quiz,
    });
  }, [quiz]);

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

  const playSound = () => {
    const audio = new Audio(successSound);
    audio.play().catch(error => console.error("Error playing sound:", error));
  };
  
  const nextQuestion = useCallback(() => {
    if (answerSelected) {
      playSound();
    }

    if (currentQuestion < qnaSet.length - 1) {
      setCurrentQuestion((curr) => curr + 1);
    }
    setAnswerSelected(false);
  }, [currentQuestion, qnaSet, answerSelected]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion >= 1 && currentQuestion <= qnaSet.length)
      setCurrentQuestion((curr) => curr - 1);
  }, [currentQuestion, qnaSet]);

  const progressPercentage =
    qnaSet?.length > 0 ? ((currentQuestion + 1) * 100) / qnaSet.length : 0;

  // Đổi tên và logic hàm để lưu vào DB cục bộ
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
      topicId: id,
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
        // LƯU VÀO INDEXEDDB
        await saveProgressToDB(markSheetObject);
        
        // Điều hướng đến trang kết quả để người dùng xem điểm
        navigate(`/result/${id}`, { state: { qnaSet, markSheetObject } });
    } catch (error) {
        console.error("Lỗi khi lưu bài học:", error);
    }
  }, [currentUser, date, id, navigate, qnaSet]);

  return (
    <>
      {loading && <p className="page-heading text-lg">Đang tải ...</p>}
      {error && <PageNotFound />}
      {!loading && !error && qnaSet && qnaSet?.length === 0 && <PageNotFound />}
      {!loading && !error && qnaSet && qnaSet?.length > 0 && (
        <div className="mx-auto w-[85%] animate-reveal">
          <h1 className="page-heading">Bắt đầu bài học</h1>
          <Rules />
          <div className="card mb-40 flex flex-col justify-center rounded-md p-3">
            <div className="flex flex-col items-center justify-center text-xl font-bold text-black dark:text-white sm:text-3xl">
              {qnaSet[currentQuestion].title}
              {qnaSet[currentQuestion].image && (
                <img
                  src={qnaSet[currentQuestion].image}
                  alt="Minh họa Câu hỏi"
                  className="my-4 max-h-64 object-contain"
                  onError={(e) => {
                    e.target.src = "https://example.com/hinh-anh-du-phong.jpg";
                  }}
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
        </div>
      )}
    </>
  );
}

export default Quiz;