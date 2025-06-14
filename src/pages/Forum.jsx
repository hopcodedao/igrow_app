// src/pages/Forum.jsx
import { useParams, Link } from "react-router-dom";
import { useForumPosts } from "../hooks"; // Assuming this hook fetches posts
import { useAuth } from "../contexts/AuthContext";

function Forum() {
  const { courseId } = useParams();
  const { loading, error, posts } = useForumPosts(courseId); // useForumPosts hook
  const { currentUser } = useAuth(); // useAuth hook

  return (
    <div className="mx-auto mb-32 w-[90%] max-w-5xl animate-reveal p-4 sm:p-0"> {/* Thêm padding cho mobile */}
      {/* HEADER SECTION: Title and Create New Post Button */}
      <div className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
        <h1 className="page-heading text-left text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl">
          Diễn đàn Khóa học
        </h1>
        {currentUser && (
          <Link
            to={`/course/${courseId}/forum/new`}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-primary-dark shadow-md"
          >
            <i className="fa-solid fa-plus"></i> {/* Icon thêm */}
            Tạo bài viết mới
          </Link>
        )}
      </div>

      {/* POSTS LISTING SECTION */}
      <div className="card space-y-4 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800"> {/* Tăng padding, làm tròn góc và thêm shadow */}
        {loading && (
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 py-8">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải danh sách bài viết...
          </p>
        )}
        {error && (
          <p className="text-center text-lg text-red-600 dark:text-red-400 py-8">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>Không thể tải được danh sách bài viết. Vui lòng thử lại sau.
          </p>
        )}
        {!loading && posts.length === 0 && (
          <p className="py-8 text-center text-lg text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-comment-dots mr-2"></i>Chưa có bài viết nào. Hãy là người đầu tiên bắt đầu cuộc thảo luận!
          </p>
        )}

        {!loading &&
          posts.map((post, index) => (
            <div key={post.id}>
              <Link
                to={`/course/${courseId}/post/${post.id}`}
                className="block rounded-lg p-4 transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-gray-700" // Thay đổi màu hover nhẹ nhàng hơn
              >
                <div className="flex items-start gap-4">
                  <img
                    src={
                      post.authorAvatar ||
                      `https://i.pravatar.cc/150?u=${post.authorId}`
                    }
                    alt={post.authorName}
                    className="h-14 w-14 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" // Tăng kích thước ảnh, thêm border
                  />
                  <div className="flex-1 min-w-0"> {/* Đảm bảo nội dung không tràn */}
                    <h2 className="text-xl font-semibold text-primary dark:text-secondary line-clamp-2 break-words"> {/* line-clamp-2 để giới hạn 2 dòng */}
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Đăng bởi <strong className="font-medium">{post.authorName}</strong> -{" "}
                      {new Date(post.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4"> {/* Khoảng cách và icon */}
                    <span className="material-symbols-outlined text-xl">comment</span> {/* Icon comment */}
                    <span className="font-bold text-lg">{post.commentCount || 0}</span> {/* Làm nổi bật số comment */}
                  </div>
                </div>
              </Link>
              {index < posts.length - 1 && (
                <hr className="my-4 border-t border-gray-200 dark:border-gray-700" /> // Đường phân cách giữa các bài viết
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Forum;