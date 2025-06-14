// src/components/atoms/AnswerBox.jsx
import React from 'react';

function AnswerBox({ options, handleChange }) {
  // Hàm chuyển đổi chỉ số thành chữ cái (A, B, C, ...)
  const getLetter = (index) => String.fromCharCode(65 + index);

  return (
    <ul className="flex flex-col gap-4">
      {options.map((option, index) => (
        <li
          key={index}
          onClick={() => handleChange(index)}
          className={`
            cursor-pointer rounded-md border-2 p-4 text-black dark:text-white
            ${option.checked ? 'border-primary bg-primary-light dark:bg-primary-dark font-bold' : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800'}
            hover:border-primary hover:bg-primary-light hover:dark:bg-primary-dark
            transition-all duration-200 ease-in-out
            flex items-center gap-2
          `}
        >
          <span className="min-w-[20px] text-center">{getLetter(index)}.</span>
          <span className="flex-1">{option.title}</span>
        </li>
      ))}
    </ul>
  );
}

export default AnswerBox;