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
      console.error("Thiếu courseId hoặc postId");
      setLoading(false);
      setError(true);
      return () => {};
    }

    const db = getDatabase();
    const postRef = ref(db, `forum_posts/${courseId}/${postId}`);
    const commentsRef = ref(db, `forum_comments/${postId}`);

    console.log("Đang lắng nghe dữ liệu cho bài viết:", `forum_posts/${courseId}/${postId}`);

    const postUnsubscribe = onValue(postRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("=> Đã nhận dữ liệu bài viết!");
        setPost({ id: postId, ...snapshot.val() });
      } else {
        console.error("Không tìm thấy bài viết trong database.");
        setError(true);
      }
      setLoading(false);
    });

    const commentsUnsubscribe = onValue(commentsRef, (snapshot) => {
      console.log("=> Đã nhận dữ liệu bình luận!");
      if (snapshot.exists()) {
          const data = snapshot.val();
          const commentsArray = Object.entries(data).map(([commentId, commentData]) => ({
              id: commentId,
              ...commentData,
          })).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setComments(commentsArray);
      } else {
          setComments([]);
      }
    });

    return () => {
      off(postRef, 'value', postUnsubscribe);
      off(commentsRef, 'value', commentsUnsubscribe);
    };
  }, [courseId, postId]);

  return { loading, error, post, comments };
}