import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import {
  Route,
  RouterProvider,
  Routes,
  ScrollRestoration,
  createBrowserRouter,
} from "react-router-dom";

import {
  DesignComponent,
  GoogleAnalytics,
  MainNavigationBar,
  Preloader,
  PrivateOutlet,
  PublicOutlet,
} from "./components";
// eslint-disable-next-line import/order
import { AuthProvider } from "./contexts/AuthContext";

// Logic đồng bộ dữ liệu Offline
import { getDatabase, ref, push, update, child } from "firebase/database";
import { getPendingProgressFromDB, markProgressAsSynced } from "./utils/db";

// Website Pages
import {
  About,
  DetailedSubmission,
  Home,
  Learn,
  Login,
  PageNotFound,
  Profile,
  Quiz,
  Quizzes,
  Reset,
  Result,
  SignUp,
  Submissions,
  Video,
} from "./pages";

// Make sure you only have one import like this:
import ChatAI from "./components/ChatAI"; // This should only appear once

function Root() {
  return (
    <>
      <ScrollRestoration />
      <GoogleAnalytics />
      <Routes>
        <Route element={<MainNavigationBar />}>
          <Route element={<Home />} path="/" />
          <Route element={<Quizzes />} path="/quizzes" />
          <Route element={<About />} path="/about" />
          <Route element={<ChatAI />} path="/chat-ai" />
          <Route element={<Reset />} path="/reset" />
          <Route element={<Learn />} path="/learn" />
          <Route element={<PublicOutlet />} path="/">
            <Route element={<SignUp />} path="signup" />
            <Route element={<Login />} path="login" />
          </Route>
          <Route element={<PrivateOutlet />} path="/">
            <Route
              element={<Quiz />}
              errorElement={<PageNotFound />}
              path="quiz/:id"
            />
            <Route
              element={<Video />}
              errorElement={<PageNotFound />}
              path="video/:id"
            />
            <Route element={<Profile />} path="profile" />
            <Route element={<Submissions />} path="submissions" />
            <Route
              element={<DetailedSubmission />}
              errorElement={<PageNotFound />}
              path="detailed-submission"
            />
            <Route
              element={<Result />}
              errorElement={<PageNotFound />}
              path="result/:id"
            />
          </Route>
          <Route element={<PageNotFound />} path="*" />
        </Route>
      </Routes>
    </>
  );
}

const router = createBrowserRouter([{ path: "*", Component: Root }]);

function App() {
  // Website theme
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Preloading state
  const [preloading, setPreloading] = useState(true);

  // Display preloading animation
  useEffect(() => {
    setTimeout(() => {
      setPreloading(false);
    }, 1000);
  }, []);

  // <<<----- LOGIC ĐỒNG BỘ DỮ LIỆU OFFLINE MỚI ----->>>
  useEffect(() => {
    const syncData = async () => {
      console.log("Kiểm tra dữ liệu cần đồng bộ...");
      const pendingSubmissions = await getPendingProgressFromDB();

      if (pendingSubmissions.length > 0) {
        console.log(`Tìm thấy ${pendingSubmissions.length} mục cần đồng bộ.`);
        const db = getDatabase();

        for (const submission of pendingSubmissions) {
          // Tách submissionId ra khỏi dữ liệu cần đẩy lên Firebase
          const { userId, submissionId, ...submissionData } = submission;
          const submissionsKey = push(
            child(ref(db), `submissions/${userId}`)
          ).key;
          const submissionsUpdate = {};
          submissionsUpdate[`submissions/${userId}/${submissionsKey}`] =
            submissionData;

          try {
            // Đẩy dữ liệu lên Firebase
            await update(ref(db), submissionsUpdate);

            // Nếu thành công, đánh dấu đã đồng bộ trong IndexedDB
            await markProgressAsSynced(submissionId);
            console.log(`Đã đồng bộ thành công mục: ${submissionId}`);
          } catch (error) {
            console.error(`Lỗi đồng bộ mục ${submissionId}:`, error);
          }
        }
      } else {
        console.log("Không có dữ liệu mới để đồng bộ.");
      }
    };

    // Chạy đồng bộ khi ứng dụng khởi động
    syncData();

    // Lắng nghe sự kiện khi có kết nối mạng trở lại để chạy đồng bộ
    window.addEventListener("online", syncData);

    // Dọn dẹp listener khi component không còn được sử dụng
    return () => {
      window.removeEventListener("online", syncData);
    };
  }, []);
  // <<<----- KẾT THÚC LOGIC ĐỒNG BỘ ----->>>

  return (
    <div>
      {preloading && <Preloader />}

      {!preloading && (
        <AuthProvider>
          <DesignComponent />
          <RouterProvider router={router} />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                color: "#000",
                fontWeight: 600,
                background: "#44BBA9",
              },
              duration: 3000,
            }}
          />
        </AuthProvider>
      )}
    </div>
  );
}

export default App;
