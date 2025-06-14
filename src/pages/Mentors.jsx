// src/pages/Mentors.jsx
import { useData } from '../hooks';
import { Footer } from '../components';

function MentorCard({ mentor }) {
  return (
    <div className="card flex flex-col items-center p-6 text-center">
      <img 
        src={mentor.avatarUrl || `https://i.pravatar.cc/150?u=${mentor.name}`} 
        alt={mentor.name}
        className="mb-4 h-32 w-32 rounded-full object-cover shadow-lg"
      />
      <h2 className="text-xl font-bold text-primary dark:text-secondary">{mentor.name}</h2>
      <p className="font-semibold text-gray-700 dark:text-gray-300">{mentor.title}</p>
      <p className="mb-4 text-sm text-gray-500">{mentor.organization}</p>
      <p className="flex-grow text-justify text-sm dark:text-gray-400">{mentor.bio}</p>
      <a 
        href={`mailto:${mentor.contactEmail}`}
        className="fill-button mt-4 w-full"
      >
        Liên hệ
      </a>
    </div>
  );
}

function Mentors() {
  const { loading, error, data: mentors } = useData('mentors');

  return (
    <>
      <div className="mx-auto mb-32 w-[90%] animate-reveal">
        <h1 className="page-heading">Gặp gỡ Cố vấn</h1>
        <p className="-mt-8 mb-12 text-center text-lg text-gray-600 dark:text-gray-400">
          Kết nối với các chuyên gia để nhận được lời khuyên và sự định hướng cho sự nghiệp của bạn.
        </p>

        {loading && <p className="text-center">Đang tải danh sách cố vấn...</p>}
        {error && <p className="text-center text-red-500">Không thể tải được danh sách cố vấn.</p>}

        {!loading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor, index) => (
              <MentorCard key={index} mentor={mentor} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Mentors;