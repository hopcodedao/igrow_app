import igownImage from '../assets/images/igown.png';

const aboutDetails = [
  `Chào mừng đến với iGrow - Nền tảng trao quyền kỹ năng số và tư duy khởi nghiệp cho thanh niên dân tộc thiểu số! Dự án iGrow ra đời từ chính những trăn trở và hoạt động thực tiễn của nhóm tại vùng Đồng bằng sông Cửu Long (ĐBSCL). `,
  `Qua quá trình làm việc trực tiếp với thanh niên các dân tộc Khơ-me, Hoa, Chăm tại Sóc Trăng, Trà Vinh, An Giang, chúng tôi nhận thấy một nhu cầu cấp thiết về việc nâng cao kỹ năng số và tư duy khởi nghiệp.  Để giải quyết bài toán này, iGrow được xây dựng thành một giải pháp giáo dục, hiện thực hóa qua ứng dụng di động ưu tiên hoạt động ngoại tuyến (offline-first) và tích hợp Trí tuệ nhân tạo (AI). `,
  `Mục tiêu của iGrow là cung cấp các chương trình đào tạo cá nhân hóa, phù hợp với văn hóa và điều kiện đặc thù của thanh niên DTTS tại ĐBSCL và tiến tới mở rộng ra cả nước.  Chúng tôi tập trung vào việc thu hẹp khoảng cách số và thúc đẩy bình đẳng cơ hội, qua đó giúp thanh niên DTTS tự tin hội nhập vào nền kinh tế số và hướng tới phát triển bền vững. `,
  `iGrow không chỉ cung cấp kiến thức thông qua các khóa học được cá nhân hóa bằng AI mà còn chú trọng xây dựng một cộng đồng học tập tương tác và một mạng lưới hỗ trợ mạnh mẽ.  Điểm nhấn của iGrow là việc tích hợp các yếu tố văn hóa bản địa vào nội dung và phương pháp giảng dạy để các bài học trở nên gần gũi, dễ tiếp thu hơn. `,
  `Cảm ơn bạn đã lựa chọn iGrow làm người bạn đồng hành trên con đường chinh phục tri thức số và hiện thực hóa các ý tưởng khởi nghiệp. Xin cảm ơn!`
];

function About() {
  return (
    <div className="mx-auto flex w-[85%] animate-reveal flex-col items-center justify-center">
      <h1 className="page-heading">Giới thiệu về iGrow</h1>
      <div className="flex flex-col items-center justify-center text-center">
        {/* Thêm hình ảnh thành viên ở đây */}
        <img
          src={igownImage}
          alt="Thành viên iGrow"
          className="w-full max-w-lg h-auto rounded-lg mb-8 shadow-lg object-contain"
        />
      </div>

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
          href="https://nguyenhoahop.id.vn/"
          rel="noreferrer"
          target="_blank"
        >
          Nhóm Empower - Dự án iGrow.
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