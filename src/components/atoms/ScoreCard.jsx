import { useAuth } from "../../contexts/AuthContext";
import { useCertificate } from "../../hooks";

function ScoreCard({
  topicId,
  location,
  noq,
  date,
  correctAnswersCount,
  incorrectAnswersCount,
  unattemptedCount,
  obtainedPoints,
  obtainedPercentage,
}) {
  const { currentUser } = useAuth();

  return (
    <div className="card mx-auto flex flex-col rounded-xl lg:w-[500px]">
      <span className="mb-2 w-full text-center text-4xl font-semibold uppercase tracking-wider text-black drop-shadow-xl dark:text-white lg:text-5xl">
        Kết quả học tập
      </span>
      <span className="mb-4 w-full text-center text-3xl font-bold text-primary drop-shadow-xl dark:text-secondary lg:text-4xl">
        ĐẠT {obtainedPercentage}%
      </span>

      <div className="score-row [&>*]:text-black [&>*]:dark:text-white">
        <p className="text-left">Nội dung</p>
        <p>Số lượng</p>
        <p>Điểm</p>
      </div>

      <div className="score-row [&>*]:text-green-500">
        <p className="text-left">Trả lời đúng</p>
        <p>{correctAnswersCount}</p>
        <p>+{correctAnswersCount * 10}</p>
      </div>

      <div className="score-row [&>*]:text-red-500">
        <p className="text-left">Trả lời sai</p>
        <p>{incorrectAnswersCount}</p>
        <p>-{incorrectAnswersCount * 2}</p>
      </div>

      <div className="score-row [&>*]:text-gray-500">
        <p className="text-left">Bỏ qua</p>
        <p>{unattemptedCount}</p>
        <p>NA</p>
      </div>

      <div className="marks">
        <div className="justify-self-start">Tổng điểm</div>
        <div>{obtainedPoints}</div>
      </div>
      <div className="marks">
        <div className="justify-self-start">Số câu hỏi</div>
        <div>{noq}</div>
      </div>
      <div className="marks">
        <div className="justify-self-start">Điểm tối đa</div>
        <div>{noq * 10}</div>
      </div>

      {location === "result" && obtainedPercentage >= 60 ? (
        <button
          className="border-button mx-auto mb-2 mt-6 w-fit rounded-lg border-2 border-primary px-4 py-2 font-semibold tracking-wider"
          title="Nhận Chứng Nhận"
          type="button"
          onClick={() =>
            useCertificate(
              currentUser.displayName,
              topicId,
              obtainedPercentage,
              date
            )
          }
        >
          <span className="uppercase">Nhận chứng nhận</span>
        </button>
      ) : (
        <p className="mt-6 text-center font-medium uppercase text-red-500 sm:text-lg">
          Hoàn thành ít nhất 60% để nhận Chứng nhận
        </p>
      )}
    </div>
  );
}

export default ScoreCard;