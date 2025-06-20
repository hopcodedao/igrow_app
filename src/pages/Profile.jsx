// src/pages/Profile.jsx
import { useState } from "react";

import { UserDetail } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { useAlert, useGAEventTracker } from "../hooks";
import useUserAchievements from "../hooks/useUserAchievements"; // <-- Import hook mới

function Profile() {
  const gaEventTracker = useGAEventTracker("Profile Page");
  const { currentUser, updateProfileImage, updateUserName, resetPassword } = useAuth();
  const [resetLoading, setResetLoading] = useState(false);
  const { loading: achievementsLoading, achievements } = useUserAchievements(currentUser?.uid); // <-- Dùng hook mới

  async function sendResetMail() {
    gaEventTracker({ label: "Reset Password" });
    if (!confirm("Bạn có muốn khôi phục mật khẩu?")) return;
    try {
      setResetLoading(true);
      document.body.style.cursor = "wait";
      await resetPassword(currentUser.email);
      useAlert("success", "mail-sent");
      document.body.style.cursor = "default";
    } catch (err) {
      setResetLoading(false);
      document.body.style.cursor = "default";
      useAlert("error", err.code);
    }
  }

  return (
    <div className="mx-auto flex animate-reveal flex-col items-center justify-center sm:text-xl">
      <h1 className="page-heading">Chi tiết tài khoản</h1>

      <div className="card mx-10 my-8 flex flex-col items-center justify-center space-y-6 rounded-3xl px-10">
        <UserDetail currentUser={currentUser} data="photoURL" updateDetail={updateProfileImage} />

        <div className="flex flex-col gap-5 sm:gap-10">
          <UserDetail currentUser={currentUser} data="displayName" updateDetail={updateUserName} />

          <div className="flex flex-col justify-start sm:flex-row">
            <span className="mr-4 text-secondary">Email:</span>
            <span className="font-medium text-black dark:text-white">
              {currentUser.email}
            </span>
          </div>

          <div className="flex flex-col justify-start sm:flex-row">
            <span className="mr-4 text-secondary">Số điện thoại:</span>
            <span className="font-medium text-black dark:text-white">
              {currentUser.phoneNumber || "Chưa được cung cấp!"}
            </span>
          </div>

          <div className="flex flex-col justify-start sm:flex-row">
            <span className="mr-4 text-secondary">Xác thực Email:</span>
            <span className="font-medium text-black dark:text-white">
              {currentUser.emailVerified ? "Đã xác thực" : "Đang chờ xử lý!"}
            </span>
          </div>

          <div className="my-2 flex w-full items-center justify-center">
            <button
              className="border-button rounded-lg border px-4 py-2"
              disabled={resetLoading}
              type="button"
              onClick={sendResetMail}
            >
              <span className="material-symbols-outlined text-4xl text-black dark:text-black xl:text-2xl">
                lock_reset
              </span>
              <span className="ml-2 text-sm font-medium uppercase dark:text-black sm:text-base">
                Khôi phục mật khẩu
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ----- PHẦN HIỂN THỊ HUY HIỆU MỚI ----- */}
      <div className="mx-10 my-8 w-full max-w-4xl">
        <h2 className="page-heading my-4 text-3xl">Thành tích & Huy hiệu</h2>
        {achievementsLoading ? (
          <p>Đang tải huy hiệu...</p>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((badge) => (
              <div key={badge.id} className="card flex items-center gap-4 p-4">
                <span className="material-symbols-outlined rounded-full bg-secondary p-3 text-4xl text-white">
                  {badge.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{badge.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Bạn chưa đạt được huy hiệu nào. Hãy bắt đầu một khóa học!</p>
        )}
      </div>
      {/* ----- KẾT THÚC PHẦN HUY HIỆU ----- */}
    </div>
  );
}

export default Profile;
