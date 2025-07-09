import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import ErrorPage from "./pages/ErrorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PostListPage from "./pages/PostListPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import WritePage from "./pages/WritePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <PostListPage />,
      },
      {
        path: "posts",
        element: <PostListPage />,
      },
      {
        path: "posts/:id",
        element: <PostDetailPage />,
      },
      {
        path: "write",
        element: <WritePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      // 앞으로 다른 페이지들을 이곳에 추가할 수 있습니다.
      // { path: "login", element: <LoginPage /> }
      {
        path: "*", // 일치하는 경로가 없을 때
        element: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
