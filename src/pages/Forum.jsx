// src/pages/Forum.jsx
import { useParams, Link } from "react-router-dom";
import { useForumPosts } from "../hooks";
import { useAuth } from "../contexts/AuthContext";

function Forum() {
  const { courseId } = useParams();
  const { loading, error, posts } = useForumPosts(courseId);
  const { currentUser } = useAuth();

  return (
    <div className="mx-auto mb-32 w-[90%] max-w-5xl animate-reveal">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="page-heading my-4 text-left">Thảo luận khóa học</h1>
        {currentUser && (
          <Link
            to={`/course/${courseId}/forum/new`}
            className="fill-button mb-4 sm:mb-0"
          >
            Tạo bài viết mới
          </Link>
        )}
      </div>

      <div className="card space-y-4 p-4">
        {loading && <p>Đang tải danh sách bài viết...</p>}
        {error && <p>Không thể tải được danh sách bài viết.</p>}
        {!loading && posts.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            Chưa có bài viết nào. Hãy là người đầu tiên bắt đầu cuộc thảo luận!
          </p>
        )}

        {!loading &&
          posts.map((post) => (
            <Link
            key={post.id}
            to={`/course/${courseId}/post/${post.id}`}
            className="block rounded-lg p-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    post.authorAvatar ||
                    `https://i.pravatar.cc/150?u=${post.authorId}`
                  }
                  alt={post.authorName}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-primary dark:text-secondary">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Đăng bởi <strong>{post.authorName}</strong> -{" "}
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="material-symbols-outlined">forum</span>
                  <span>{post.commentCount || 0}</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Forum;
