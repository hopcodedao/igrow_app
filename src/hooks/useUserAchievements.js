 // src/hooks/useUserAchievements.js
import { get, getDatabase, ref } from 'firebase/database';
import { useEffect, useState } from 'react';

export default function useUserAchievements(userId) {
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    async function fetchAchievements() {
      if (!userId) {
          setLoading(false);
          return;
      };
      setLoading(true);
      try {
        const db = getDatabase();
        const userAchievementsRef = ref(db, `user_achievements/${userId}`);
        const badgesRef = ref(db, 'badges');

        const [achievementsSnapshot, badgesSnapshot] = await Promise.all([
            get(userAchievementsRef),
            get(badgesRef)
        ]);

        if (achievementsSnapshot.exists() && badgesSnapshot.exists()) {
            const earnedBadgesIds = Object.keys(achievementsSnapshot.val());
            const allBadges = badgesSnapshot.val();
            const earnedBadgesDetails = earnedBadgesIds.map(id => ({
                id,
                ...allBadges[id]
            }));
            setAchievements(earnedBadgesDetails);
        }
      } catch (err) {
        console.error("Lỗi khi tải thành tích:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [userId]);

  return { loading, achievements };
}