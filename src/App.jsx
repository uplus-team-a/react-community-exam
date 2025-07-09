import "./index.css";
import Layout from "./layouts/Layout";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./libs/supabase";
import { useUserStore } from "./stores/userStore";

function App() {
  const navigate = useNavigate();
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    // onAuthStateChange는 인증 상태(로그인, 로그아웃 등)가 변경될 때마다 호출됩니다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        // 사용자가 성공적으로 로그인했을 때
        setUser(session.user);
        // 로그인 후 메인 페이지로 리디렉션
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        // 사용자가 로그아웃했을 때
        clearUser();
        // 로그아웃 후 로그인 페이지로 리디렉션
        navigate("/login");
      }
    });

    // 컴포넌트가 언마운트될 때 구독을 정리합니다.
    return () => subscription.unsubscribe();
  }, [navigate, setUser, clearUser]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;
