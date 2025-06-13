// src/utils/gamification.js
import { getDatabase, ref, get, set } from "firebase/database";

// Hàm kiểm tra và trao huy hiệu "Học Viên Xuất Sắc"
async function checkAndAwardPerfectScoreBadge(userId, obtainedPercentage) {
    if (obtainedPercentage >= 100) {
        const db = getDatabase();
        const achievementRef = ref(db, `user_achievements/${userId}/perfect_score`);
        const snapshot = await get(achievementRef);
        // Chỉ trao huy hiệu nếu họ chưa có
        if (!snapshot.exists()) {
            console.log(`Trao huy hiệu "perfect_score" cho user: ${userId}`);
            await set(achievementRef, {
                badgeId: 'perfect_score',
                earnedAt: new Date().toISOString()
            });
        }
    }
}

// Hàm kiểm tra và trao huy hiệu "Bước Chân Đầu Tiên"
async function checkAndAwardFirstLessonBadge(userId) {
    const db = getDatabase();
    const userAchievementsRef = ref(db, `user_achievements/${userId}`);
    const snapshot = await get(userAchievementsRef);
    // Nếu người dùng chưa có huy hiệu nào, đây là lần đầu tiên của họ
    if (!snapshot.exists()) {
        console.log(`Trao huy hiệu "first_lesson" cho user: ${userId}`);
        const firstLessonRef = ref(db, `user_achievements/${userId}/first_lesson`);
        await set(firstLessonRef, {
            badgeId: 'first_lesson',
            earnedAt: new Date().toISOString()
        });
    }
}


// Hàm tổng hợp, sẽ được gọi sau mỗi lần hoàn thành bài học
export async function checkAndAwardBadges(userId, lessonResult) {
    await checkAndAwardFirstLessonBadge(userId);
    await checkAndAwardPerfectScoreBadge(userId, lessonResult.obtainedPercentage);
    // Thêm các hàm kiểm tra huy hiệu khác ở đây (ví dụ: hoàn thành khóa học)
}