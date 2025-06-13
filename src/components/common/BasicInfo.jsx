import { CountUpAnimation } from '..';

const reasons = [
  {
    image: 'school',
    heading: 'Kỹ năng số thực chiến',
    description:
      'iGrow cung cấp kiến thức cập nhật về marketing số, bán hàng online, và xây dựng thương hiệu cá nhân mà bạn có thể áp dụng ngay để bắt đầu kinh doanh.'
  },
  {
    image: 'rocket_launch',
    heading: 'Tư duy khởi nghiệp',
    description:
      'Các bài học được thiết kế để không chỉ truyền đạt kiến thức, mà còn khơi dậy và nuôi dưỡng tinh thần dám nghĩ, dám làm, sẵn sàng cho hành trình khởi nghiệp.'
  },
  {
    image: 'smartphone',
    heading: 'Học mọi lúc, mọi nơi',
    description:
      'Với tính năng truy cập offline, bạn có thể học tập ngay cả khi không có kết nối internet, phá vỡ mọi rào cản về địa lý và hạ tầng mạng.'
  },
  {
    image: 'psychology',
    heading: 'Lộ trình cá nhân hóa',
    description:
      'Nền tảng ứng dụng AI để gợi ý các khóa học phù hợp với năng lực và mục tiêu của từng cá nhân, giúp bạn phát triển theo con đường riêng hiệu quả nhất.'
  }
];

function BasicInfo() {
  return (
    <>
      <div className="my-32 w-full overflow-x-hidden border-y-2 border-black bg-primary py-10 drop-shadow-lg dark:border-white">
        <div className="mx-auto grid w-[calc(100vw-25%)] grid-cols-2 gap-10 md:grid-cols-4">
          <p className="stat">
            <CountUpAnimation end={50} />
            <span className="block text-base md:text-lg">Bài học</span>
          </p>
          <p className="stat">
            <CountUpAnimation end={10} />
            <span className="block text-base md:text-lg">Khóa học</span>
          </p>
          <p className="stat">
            <CountUpAnimation end={20} />
            <span className="block text-base md:text-lg">Dự án mẫu</span>
          </p>
          <p className="stat">
            <CountUpAnimation end={1000} />
            <span className="block text-base md:text-lg">Học viên</span>
          </p>
        </div>
      </div>
      <div className="mb-20 w-[85%]">
        <p className="mb-20 text-center text-4xl font-bold uppercase tracking-wider lg:text-5xl">
          Tại sao nên chọn iGrow?
        </p>
        <div className="grid grid-cols-1 place-content-center gap-x-10 gap-y-16 xl:grid-cols-2 2xl:grid-cols-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="card mx-auto flex max-w-[500px] flex-col gap-y-4 border-0 border-b-4 !border-b-primary p-8 text-center transition-transform hover:scale-105 hover:shadow-xl"
            >
              <div className="mx-auto mb-4 grid h-fit w-fit place-content-center rounded-full border-2 border-primary bg-secondary p-4 drop-shadow-md">
                <span className="material-symbols-outlined text-5xl text-white">
                  {reason.image}
                </span>
              </div>
              <p className="text-xl font-semibold">{reason.heading}</p>
              <p className="font-medium text-justify">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BasicInfo;