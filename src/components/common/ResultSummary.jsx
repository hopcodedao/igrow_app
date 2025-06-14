import { ScoreCard } from "..";

function ResultSummary({
  showTopicID = false,
  topicId,
  topicTitle, // ✅ Thêm topicTitle
  noq,
  correctAnswersCount,
  incorrectAnswersCount,
  unattemptedCount,
  obtainedPoints,
  obtainedPercentage,
  date,
}) {
  return (
    <div className="mx-auto">
      {showTopicID && <h1 className="page-heading">TỔNG KẾT</h1>}
      <ScoreCard
        topicId={topicId}
        topicTitle={topicTitle} // ✅ Truyền topicTitle vào ScoreCard
        location="result"
        noq={noq}
        date={date}
        correctAnswersCount={correctAnswersCount}
        incorrectAnswersCount={incorrectAnswersCount}
        unattemptedCount={unattemptedCount}
        obtainedPoints={obtainedPoints}
        obtainedPercentage={obtainedPercentage}
      />
    </div>
  );
}

export default ResultSummary;
