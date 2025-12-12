import { useState } from "react";
import HeaderDesktop from "./HeaderDesktop";
import { Link, useNavigate } from "react-router-dom";

export default function LoginDesktop() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("log");
    try {
      fetch("https://nss-api.kro.kr/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: id,
          password: pw,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (!result.ok) {
            console.log(result);
            alert("제대로 좀 입력해주세요");
          } else navigate("/");
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="LoginPageWrapper">
      <HeaderDesktop />
      <div className="login-page-wrapper">
        <div className="login-page">
          <div className="login-form-wrapper">
            <div className="id-blank-wrapper">
              <div className="login-label">아이디</div>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div className="password-blank-wrapper">
              <div className="login-label">비밀번호</div>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </div>
            <div className="login-footer-wrapper">
              <Link to="/register">
                <div className="no-account-wrapper">
                  <div className="no-accout-text">계정이 없으신가요?</div>
                  <div className="no-account-underline" />
                </div>
              </Link>

              <div
                className="login-button-on-loginpage"
                onClick={handleSubmit}
                style={{ cursor: "pointer" }}
              >
                로그인
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
