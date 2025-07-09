import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {registerUser} from "../serivce/userService.js";
import useUserStore from "../stores/userStore.js";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    // Use the registerUser function instead of Supabase auth
    const {data, error} = await registerUser(email, password, nickname);

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("회원가입 실패", error);
      return;
    }

    // No email verification needed, directly set user and redirect
    setSuccess("가입 및 로그인 완료!");
    useUserStore.getState().setUser(data);
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">회원가입</h2>
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">이메일</span>
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="nickname">
              <span className="label-text">닉네임</span>
            </label>
            <input
              id="nickname"
              type="text"
              className="input input-bordered"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">비밀번호</span>
            </label>
            <input
              id="password"
              type="password"
              className="input input-bordered"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autocomplete="new-password"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="confirmPassword">
              <span className="label-text">비밀번호 확인</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input input-bordered"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autocomplete="new-password"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
          <div className="form-control mt-6">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner"/>
              ) : (
                "가입하기"
              )}
            </button>
          </div>
          <p className="text-center text-sm mt-2">
            이미 계정이 있으신가요?{" "}
            <Link className="link link-hover" to="/login">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
