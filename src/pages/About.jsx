const aboutDetails = [
  `Chào mừng đến với ATGTech - Hệ thống các bài kiểm tra an toàn giao thông! Mục tiêu của ATGTech là cung cấp cho bạn một cách thú vị và hấp dẫn để kiểm tra kiến thức của bạn về luật giao thông và quy định.`,

  `ATGTech được xây nhằm mục đích tăng cường công tác tuyên truyền, phổ biến pháp luật về trật tự, an toàn giao thông; nâng cao kiến thức và ý thức chấp hành pháp luật về trật tự, an toàn giao thông cho mọi người dân; góp phần xây dựng văn hóa ứng xử khi tham gia giao thông.`,

  `ATGTech cung cấp một loạt các bài kiểm tra được thiết kế theo từng chủ đề riêng biệt. Từ câu hỏi trắc nghiệm đến các tình huống thực tế, các bài kiểm tra của ATGTech được thiết kế để kiểm tra kiến thức của bạn một cách thú vị và thông tin. ATGTech cung cấp phản hồi tức thì về câu trả lời của bạn, giúp bạn học hỏi và nâng cao kiến thức về an toàn giao thông.`,

  `Ngoài việc cung cấp các bài kiểm tra an toàn giao thông miễn phí, ATGTech cũng cung cấp nguồn videos tuyên truyền về pháp luật an toàn giao thông. ATGTech tin rằng mọi người đều có thể tiếp cận kiến thức về chấp hành phát luật về trật tự, an toàn giao thông cho mọi người dân; góp phần xây dựng văn hóa ứng xử khi tham gia giao thông.`,

  `Cảm ơn bạn đã chọn ATGTech là nguồn thông tin hàng đầu cho các bài kiểm tra và hỗ trợ cung cấp các kiến thức về trật tự an toàn giao thông. Xin cảm ơn!`

  
];

function About() {
  return (
    <div className="mx-auto flex w-[85%] animate-reveal flex-col items-center justify-center">
      <h1 className="page-heading">Giới thiệu về ATGTech</h1>

      <div className="card flex !w-full max-w-4xl flex-col gap-10 p-6 text-justify font-medium dark:text-red-300 sm:w-3/5 sm:text-xl">
        {aboutDetails.map((para, index2) => (
          <p
            key={index2}
            className="indent-10 first-letter:text-xl dark:text-gray-300 sm:first-letter:text-2xl"
          >
            {para}
          </p>
        ))}
      </div>

      <span className="mt-14 block font-semibold tracking-wide">
      Thiết kế và phát triển 💚 bởi &nbsp;
        <a
          className="cursor-pointer hover:underline"
          href="/"
          rel="noreferrer"
          target="_blank"
        >
          ATGTech.
        </a>
      </span>

      <div className=" mt-8 inline-flex w-full items-center justify-center">
        <hr className="my-8 h-1 w-64 rounded border-0 bg-primary dark:bg-secondary" />
        <div className="absolute left-1/2 -translate-x-1/2 bg-light px-4 dark:bg-dark">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-gray-700 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 27"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default About;
