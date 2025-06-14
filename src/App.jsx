// src/App.jsx

// React & Router imports
import { useEffect, useState } from "react";
import {
  Route,
  RouterProvider,
  Routes,
  ScrollRestoration,
  createBrowserRouter,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Firebase and Offline DB imports
import { getDatabase, ref, push, update, child } from "firebase/database";
import { getPendingProgressFromDB, markProgressAsSynced } from "./utils/db";

// App Components
import {
  DesignComponent,
  GoogleAnalytics,
  MainNavigationBar,
  Preloader,
  PrivateOutlet,
  PublicOutlet,
} from "./components";
import { AuthProvider } from "./contexts/AuthContext";

import { AdminLayout, AdminDashboard, ManageCourses, CourseForm } from './pages';
import { AdminOutlet } from './components';

// App Pages
import {
  About,
  CourseDetail,
  Courses,
  DetailedSubmission,
  Forum,
  NewPost,
  PostDetail,
  Home,
  Learn,
  Mentors,
  Lesson,
  Login,
  PageNotFound,
  Profile,
  Reset,
  Result,
  SignUp,
  Submissions,
  Video,
} from "./pages";

function Root() {
  return (
    <>
      <ScrollRestoration />
      <GoogleAnalytics />
      <Routes>
        <Route element={<MainNavigationBar />}>
          <Route element={<Home />} path="/" />
          <Route element={<Courses />} path="/courses" />
          <Route element={<About />} path="/about" />
          <Route element={<Reset />} path="/reset" />
          <Route element={<Learn />} path="/learn" />
          <Route element={<Mentors />} path="/mentors" />
          <Route element={<PublicOutlet />} path="/">
            <Route element={<SignUp />} path="signup" />
            <Route element={<Login />} path="login" />
          </Route>
          <Route element={<PrivateOutlet />} path="/">
            <Route element={<CourseDetail />} path="/course/:courseId" />
            <Route element={<Forum />} path="/course/:courseId/forum" />
            <Route element={<NewPost />} path="/course/:courseId/forum/new" />
            <Route element={<PostDetail />} path="/course/:courseId/post/:postId" />
            <Route
              element={<Lesson />}
              errorElement={<PageNotFound />}
              path="/lesson/:lessonId"
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
          <Route element={<AdminOutlet />} path="/admin">
              <Route element={<AdminLayout />}>  {/* <-- Bọc các trang admin bằng Layout */}
                  <Route index element={<AdminDashboard />} />
                  <Route path="courses" element={<ManageCourses />} />
                  <Route path="courses/new" element={<CourseForm />} />
                  <Route path="courses/edit/:courseId" element={<CourseForm />} />
              </Route>
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

  useEffect(() => {
    setTimeout(() => {
      setPreloading(false);
    }, 1000);
  }, []);

  // <<<----- LOGIC ĐỒNG BỘ DỮ LIỆU OFFLINE ----->>>
  useEffect(() => {
    const syncData = async () => {
      console.log("Kiểm tra dữ liệu cần đồng bộ...");
      const pendingSubmissions = await getPendingProgressFromDB();

      if (pendingSubmissions.length > 0) {
        console.log(`Tìm thấy ${pendingSubmissions.length} mục cần đồng bộ.`);
        const db = getDatabase();

        for (const submission of pendingSubmissions) {
          const { userId, submissionId, ...submissionData } = submission;
          const submissionsKey = push(
            child(ref(db), `submissions/${userId}`)
          ).key;
          const submissionsUpdate = {};
          submissionsUpdate[`submissions/${userId}/${submissionsKey}`] =
            submissionData;
          try {
            await update(ref(db), submissionsUpdate);
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

    syncData();
    window.addEventListener("online", syncData);
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
