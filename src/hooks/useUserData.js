// src/hooks/useUserData.js
import { get, getDatabase, ref } from 'firebase/database';
import { useEffect, useState } from 'react';

export default function useUserData(uid) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!uid) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu người dùng:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, [uid]);

  return { loading, userData };
}