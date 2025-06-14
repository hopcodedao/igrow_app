// src/components/forms/CommentForm.jsx
import { useState } from 'react';
import { getDatabase, ref, push, set, runTransaction } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';

function CommentForm({ courseId, postId }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const newCommentData = {
      content,
      authorId: currentUser.uid,
      authorName: currentUser.displayName || 'Người dùng ẩn danh',
      authorAvatar: currentUser.photoURL || '',
      createdAt: new Date().toISOString(),
    };

    try {
      const db = getDatabase();
      // Thêm bình luận mới
      const commentsRef = ref(db, `forum_comments/${postId}`);
      const newCommentRef = push(commentsRef);
      await set(newCommentRef, newCommentData);

      // Cập nhật số lượng bình luận trên bài viết
      const postRef = ref(db, `forum_posts/${courseId}/${postId}/commentCount`);
      await runTransaction(postRef, (currentCount) => (currentCount || 0) + 1);

      setContent(''); // Xóa nội dung form sau khi gửi
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex items-start gap-4">
      <img src={currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`} alt="avatar" className="h-12 w-12 rounded-full" />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="w-full rounded-md border border-gray-300 p-3 dark:border-gray-600 dark:bg-dark"
          rows="3"
          required
        ></textarea>
        <button type="submit" className="fill-button mt-2 px-4 py-2" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;