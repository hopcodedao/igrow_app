import { useState } from "react";

import { coding, hero } from "../assets";
import { BasicInfo, ContactUs, Footer, FeaturedCourses } from "../components";

function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`mt-10 flex animate-reveal flex-col items-center justify-center xl:mt-28 ${
        !imageLoaded && "hidden"
      }`}
    >
      <div className="relative mx-auto aspect-[8/5] max-w-xl overflow-hidden px-4 xl:mt-8 2xl:max-w-3xl">
        <div className="absolute left-1/2 top-4 -translate-x-1/2 flex w-full justify-center pr-1 md:top-8 z-10">
          <img
            alt="Biểu tượng coding"
            // Đã tăng kích thước của icon coding lên
            className="w-20 h-20 origin-center animate-rotate rounded-full drop-shadow-lg md:w-32 md:h-32 md:rounded-full mb-4"
            src={coding}
          />
        </div>

        <img
          alt=""
          className="object-cover drop-shadow-lg"
          height={400}
          src={hero}
          width={670}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="mx-8 flex flex-col items-center justify-center gap-2">
        <p className="page-heading pt-2 my-4 text-center text-2xl font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 drop-shadow-lg md:text-2xl lg:text-5xl">
          {/* Áp dụng văn bản gradient và đổ bóng để nổi bật */}
          Trao quyền kỹ năng số và tư duy khởi nghiệp cho thanh niên dân tộc
          thiểu số
        </p>

        <p className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-center text-white font-semibold tracking-wide md:text-2xl shadow-lg">
          {" "}
          {/* Sử dụng nền gradient cho vẻ ngoài hiện đại hơn, tăng kích thước văn bản, thêm đổ bóng */}
          iGrow là dự án cung cấp các chương trình đào tạo cá nhân
          hóa, phù hợp với văn hóa và điều kiện đặc thù của thanh niên dân tộc
          thiểu số tại vùng Đồng bằng sông Cửu Long và tiến tới mở rộng ra cả
          nước{" "}
        </p>
      </div>

      <BasicInfo />
      <FeaturedCourses />
      <ContactUs />
      <Footer />
    </div>
  );
}

export default Home;
