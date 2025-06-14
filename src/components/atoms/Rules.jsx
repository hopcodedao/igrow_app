import { useState } from "react";

function Rules({ className }) {
  const [display, setDisplay] = useState(false);
  return (
    <button
      className={`card mb-6 w-full py-2 ${className}`}
      onClick={() => setDisplay((prevState) => !prevState)}
    >
      <span className="flex items-center">
        <span className=" material-symbols-outlined mr-2 text-2xl text-primary dark:text-secondary">
          description
        </span>
        <span className="text-xl font-semibold uppercase text-primary dark:text-secondary">
          Quy tắt
        </span>
        <span
          className={`material-symbols-outlined ml-auto text-3xl text-primary transition-transform duration-300 dark:text-secondary ${
            display && "rotate-45"
          }`}
        >
          add
        </span>
      </span>
      {display && (
        <>
          <hr className="my-3 h-px border-0 bg-primary" />
          <ol className="ml-6 list-disc text-left text-lg">
            <li className="mb-1">Mỗi câu hỏi có giá trị 10 điểm.</li>
            <li className="mb-1">
              Câu trả lời sai bị trừ 2 điểm.
            </li>
            <li className="mb-1">
              Không làm câu hỏi nào sẽ không bị trừ điểm.
            </li>
          </ol>
        </>
      )}
    </button>
  );
}

export default Rules;
