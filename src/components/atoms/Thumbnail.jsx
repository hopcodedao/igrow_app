import { useState } from 'react';

import { placeholder } from '../../assets';

import CountUpAnimation from './CountUpAnimation';

// Thêm "description" vào props
function Thumbnail({ title, submissions, id, noq, type, description }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  let link = null;

  if (type === 'video') {
    link = `http://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  } else {
    // Bạn nên tạo một thư mục mới cho ảnh thumbnail của khóa học
    // Ví dụ: /thumbnails/courses/${id}.webp
    link = `https://raw.githubusercontent.com/hopcodedao/thietkeantoangiaothong/refs/heads/main/thumbnails/${id}.webp`;
  }
  
  return (
    <div
      className="card flex h-full max-w-lg cursor-pointer flex-col rounded-lg border-2 transition-all duration-300 hover:border-primary"
      title={title}
    >
      <div className="card relative aspect-video w-full overflow-hidden rounded-lg p-0">
        <img
          alt={title}
          className="h-full w-full animate-reveal object-cover"
          loading="lazy"
          src={link}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = placeholder;
          }}
          onLoad={() => setImageLoaded(true)} // Sửa thành true khi ảnh thật tải xong
        />
        {!imageLoaded && <img alt="" className="absolute inset-0 h-full w-full object-cover" src={placeholder} />}
      </div>
      <div className="flex flex-grow flex-col justify-between gap-1 p-2">
        <p className="mt-1 line-clamp-2 overflow-hidden text-center font-semibold uppercase tracking-wide text-black dark:text-slate-300 sm:text-lg">
          {title}
        </p>

        {/* --- LOGIC MỚI ĐỂ HIỂN THỊ MÔ TẢ CHO KHÓA HỌC --- */}
        {type === 'course' && description && (
          <p className="line-clamp-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}

        {type === 'quiz' && (
          <div className="flex justify-between rounded-lg border-2 border-black/10 px-3 py-1 text-sm font-medium text-black drop-shadow-md dark:border-white/10 dark:text-slate-300 sm:text-base">
            <p>{noq}x Câu hỏi</p>
            <p>{noq * 10} Điểm</p>
          </div>
        )}
        {type === 'popularQuiz' && (
          <div className="flex items-center justify-center gap-1 pt-1 text-sm font-medium text-black  dark:text-slate-300 sm:text-base">
            <span className="text-xl font-semibold sm:text-2xl">
              <CountUpAnimation end={submissions * 8} />
            </span>
            <span className="font-semibold">Nộp bài</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Thumbnail;