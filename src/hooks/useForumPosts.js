// src/hooks/useForumPosts.js
import { getDatabase, ref, onValue, off } from "firebase/database";
import { useEffect, useState } from "react";

export default function useForumPosts(courseId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      setError(true);
      return;
    }

    const db = getDatabase();
    const postsRef = ref(db, `forum_posts/${courseId}`);

    const unsubscribe = onValue(
      postsRef,
      (snapshot) => {
        setLoading(false);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Chuyển object thành mảng và thêm ID vào mỗi bài viết
          const postsArray = Object.entries(data).map(([postId, postData]) => ({
            id: postId,
            ...postData,
          })).reverse(); // Đảo ngược để bài mới nhất lên đầu
          setPosts(postsArray);
        } else {
          setPosts([]); // Nếu không có bài viết nào
        }
      },
      (err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    );

    // Dọn dẹp listener khi component unmount
    return () => off(postsRef, 'value', unsubscribe);

  }, [courseId]);

  return { loading, error, posts };
}