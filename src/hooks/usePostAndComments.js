// src/hooks/usePostAndComments.js
import { getDatabase, ref, onValue, off } from "firebase/database";
import { useEffect, useState } from "react";

export default function usePostAndComments(courseId, postId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!courseId || !postId) {
      setLoading(false);
      setError(true);
      return () => {};
    }

    const db = getDatabase();
    const postRef = ref(
      db,
      `forum_posts/<span class="math-inline">\{courseId\}/</span>{postId}`
    );
    const commentsRef = ref(db, `forum_comments/${postId}`);

    // Lắng nghe thay đổi của bài viết
    const postUnsubscribe = onValue(
      postRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setPost({ id: postId, ...snapshot.val() });
        } else {
          setError(true);
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    );

    // Lắng nghe thay đổi của các bình luận
    const commentsUnsubscribe = onValue(commentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const commentsArray = Object.entries(data)
          .map(([commentId, commentData]) => ({
            id: commentId,
            ...commentData,
          }))
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sắp xếp bình luận cũ nhất trước
        setComments(commentsArray);
      } else {
        setComments([]);
      }
    });

    // Dọn dẹp cả hai listeners
    return () => {
      off(postRef, "value", postUnsubscribe);
      off(commentsRef, "value", commentsUnsubscribe);
    };
  }, [courseId, postId]);

  return { loading, error, post, comments };
}
