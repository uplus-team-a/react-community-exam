import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import AuthCallback from "./components/AuthCallback.jsx";
import CartPage from "./pages/CartPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PostListPage from "./pages/PostListPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import WritePage from "./pages/WritePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "posts",
        element: <PostListPage/>,
      },
      {
        path: "write",
        element: <WritePage/>,
      },
      {
        path: "login",
        element: <LoginPage/>,
      },
      {
        path: "profile",
        element: <ProfilePage/>,
      },
      {
        path: "signup",
        element: <SignupPage/>,
      },
      {
        path: "auth/callback",
        element: <AuthCallback/>,
      },
      {
        path: "cart",
        element: <CartPage/>,
      },
      {
        path: "products",
        element: <ProductListPage/>,
      },
      {
        index: true,
        element: <HomePage/>,
      },
      // 앞으로 다른 페이지들을 이곳에 추가할 수 있습니다.
      // { path: "login", element: <LoginPage /> }
      {
        path: "*", // 일치하는 경로가 없을 때
        element: <ErrorPage/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
