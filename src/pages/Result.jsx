import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { DetailedReport, ResultSummary } from '../components';

function Result() {
  const location = useLocation();
  const { qnaSet, markSheetObject, topicTitle } = location.state; // ✅ Nhận topicTitle từ location.state
  const [showAnswers, setShowAnswers] = useState(false);

  const {
    noq,
    topicId,
    correctAnswersCount,
    incorrectAnswersCount,
    unattemptedCount,
    obtainedPoints,
    obtainedPercentage,
    date,
  } = markSheetObject;

  return (
    <div className="mx-auto mb-20 w-[90%] animate-reveal">
      {qnaSet?.length > 0 && (
        <>
          <ResultSummary
            showTopicID
            correctAnswersCount={correctAnswersCount}
            date={date}
            incorrectAnswersCount={incorrectAnswersCount}
            noq={noq}
            obtainedPercentage={obtainedPercentage}
            obtainedPoints={obtainedPoints}
            topicId={topicId}
            topicTitle={topicTitle} // ✅ Truyền topicTitle xuống ResultSummary
            unattemptedCount={unattemptedCount}
          />

          <div className="mt-16 flex w-full items-center justify-center gap-6">
            {!showAnswers && (
              <button
                className="border-button rounded-md border-2 border-primary px-4 py-2 font-medium uppercase"
                title="Xem đáp án"
                type="button"
                onClick={() => setShowAnswers(true)}
              >
                Xem đáp án
              </button>
            )}

            <Link to={`/quiz/${topicId}`}>
              <button
                className="border-button rounded-md border-2 border-primary px-4 py-2 font-medium uppercase"
                title="Học lại"
                type="button"
              >
                Học lại
              </button>
            </Link>
          </div>

          {showAnswers && <DetailedReport qnaSet={qnaSet} />}
        </>
      )}
    </div>
  );
}

export default Result;
