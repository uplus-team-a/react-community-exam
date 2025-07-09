import { Link } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { supabase } from "../libs/supabase";

function Header() {
  const user = useUserStore((s) => s.user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link
          to="/"
          className="text-2xl font-bold text-[#0064FF] tracking-tight select-none"
        >
          ShopHub
        </Link>
        <nav>
          <ul className="flex gap-2 md:gap-4 items-center">
            <li>
              <Link
                to="/"
                className="px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-[#e6f0ff] hover:text-[#0064FF] transition-colors duration-150"
              >
                홈
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-[#e6f0ff] hover:text-[#0064FF] transition-colors duration-150"
              >
                상품목록
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-[#e6f0ff] hover:text-[#0064FF] flex items-center gap-1 transition-colors duration-150"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="#0064FF"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                장바구니
              </Link>
            </li>
            <li>
              <Link
                to="/posts"
                className="px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-[#e6f0ff] hover:text-[#0064FF] transition-colors duration-150"
              >
                게시판
              </Link>
            </li>
            {!user && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-[#e6f0ff] hover:text-[#0064FF] transition-colors duration-150"
                  >
                    로그인
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-[#e6f0ff] hover:text-[#0064FF] transition-colors duration-150"
                  >
                    회원가입
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-[#e6f0ff] hover:text-[#0064FF] transition-colors duration-150"
                >
                  내 정보
                </Link>
              </li>
            )}
            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full font-semibold text-gray-800 hover:bg-[#e6f0ff] hover:text-[#0064FF] transition-colors duration-150 bg-transparent border-none cursor-pointer"
                >
                  로그아웃
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
