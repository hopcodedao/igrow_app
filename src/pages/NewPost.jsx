// src/pages/NewPost.jsx
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../hooks';

function NewPost() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      useAlert('error', 'Vui lòng nhập cả tiêu đề và nội dung.');
      return;
    }

    setLoading(true);

    const newPostData = {
      title,
      content,
      authorId: currentUser.uid,
      authorName: currentUser.displayName || 'Người dùng ẩn danh',
      authorAvatar: currentUser.photoURL || '',
      createdAt: new Date().toISOString(),
      commentCount: 0,
    };

    try {
      const db = getDatabase();
      const postsRef = ref(db, `forum_posts/${courseId}`);
      const newPostRef = push(postsRef); // Tạo một ID mới cho bài viết
      await set(newPostRef, newPostData);

      useAlert('success', 'Đăng bài viết thành công!');
      navigate(`/course/${courseId}/forum`); // Quay trở lại trang diễn đàn
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      useAlert('error', 'Đã có lỗi xảy ra, vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-[90%] max-w-3xl animate-reveal">
      <h1 className="page-heading">Tạo bài viết thảo luận mới</h1>
      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        <div>
          <label htmlFor="post-title" className="mb-2 block text-lg font-semibold">Tiêu đề</label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Câu hỏi của bạn là gì?"
            className="w-full rounded-md border border-gray-300 p-3 dark:border-gray-600 dark:bg-dark"
            required
          />
        </div>
        <div>
          <label htmlFor="post-content" className="mb-2 block text-lg font-semibold">Nội dung</label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Mô tả chi tiết vấn đề hoặc ý kiến của bạn..."
            className="w-full rounded-md border border-gray-300 p-3 dark:border-gray-600 dark:bg-dark"
            rows="8"
            required
          ></textarea>
        </div>
        <div className="flex justify-end gap-4">
          <Link to={`/course/${courseId}/forum`} className="border-button rounded-lg px-6 py-2">
            Hủy
          </Link>
          <button type="submit" className="fill-button px-6 py-2" disabled={loading}>
            {loading ? 'Đang đăng...' : 'Đăng bài'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPost;