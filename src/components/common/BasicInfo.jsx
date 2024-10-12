import { CountUpAnimation } from '..';

const reasons = [
  {
    image: 'help',
    heading: 'Hàng ngàn câu hỏi',
    description:
      'ATGTech cung cấp một bộ sưu tập đa dạng các câu hỏi trắc nghiệm về an toàn giao thông. Các câu hỏi nâng cao kiến thức và ý thức chấp hành pháp luật về trật tự, an toàn giao thông.'
  },
  {
    image: 'smart_display',
    heading: 'Nội dung đa dạng',
    description:
      'ATGTech cung cấp các nội dung video để giúp nâng cao kiến thức các chủ đề về an toàn giao thông. Video là một cách hiệu quả để nâng cao trải nghiệm học tập và hiểu sâu hơn về các chủ đề.'
  },
  {
    image: 'verified_user',
    heading: 'Chứng chỉ bài thi',
    description:
      'ATGTech cung cấp tùy chọn để nhận được chứng chỉ sau khi hoàn thành thi trắc nghiệm. Chứng chỉ này xác thực kiến thức của bạn và chứng minh cam kết học tập và tự cải thiện của bạn.'
  },
  {
    image: 'schedule',
    heading: 'Lịch học linh hoạt',
    description:
      'Tạo lịch thi của riêng bạn với các tính năng của ATGTech. Nền tảng của ATGTech cho phép bạn tùy chỉnh các nội dung và lịch trình thi theo tốc độ và sở thích của bạn.'
  }
];

function BasicInfo() {
  return (
    <>
      <div className="my-32 w-full overflow-x-hidden border-y-2 border-black bg-primary py-10 drop-shadow-lg dark:border-white">
        <div className="mx-auto grid w-[calc(100vw-25%)] grid-cols-2 gap-10 md:grid-cols-4">
          <p className="stat">
            <CountUpAnimation end={200} />
            <span className="block text-base md:text-lg">Câu hỏi</span>
          </p>
          <p className="stat">
            <CountUpAnimation end={100} />
            <span className="block text-base md:text-lg">Bài thi trắc nghiệm</span>
          </p>
          <p className="stat">
            <CountUpAnimation end={150} />
            <span className="block text-base md:text-lg">Video</span>
          </p>
          <p className="stat">
            <CountUpAnimation end={500} />
            <span className="block text-base md:text-lg">Người thi</span>
          </p>
        </div>
      </div>
      <div className="mb-20 w-[85%]">
        <p className="mb-20 text-center text-4xl font-bold uppercase tracking-wider lg:text-5xl">
          Điều gì thú vị ở ATGTech?
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
              <p className="font-medium font-medium text-justify">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BasicInfo;
