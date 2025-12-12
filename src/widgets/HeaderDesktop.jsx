import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HeaderDesktop({}) {
  const [logined, setLogined] = useState(false);
  useEffect(() => {
    fetch("https://nss-api.kro.kr/user/verify", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        setLogined(result.ok);
        console.log("dkdld", result);
      });
  }, []);

  return (
    <div className="header-wrapper-for-line">
      <div className="header-wrapper">
        <Link to="/">
          <div className="header-logo">NSS</div>
        </Link>
        <div className="header-right-handle-wrapper">
          <Link to="/add">
            <img src="/add.svg" className="header-addicon" />{" "}
          </Link>
          <img src="/search.svg" className="header-searchicon" />
          {!logined ? (
            <Link to="/login">
              <div className="header-loginbutton">로그인</div>
            </Link>
          ) : (
            <div
              className="header-loginbutton"
              onClick={() => {
                fetch("https://nss-api.kro.kr/user/logout", {
                  method: "POST",
                  credentials: "include", // 쿠키 포함 요청
                }).then(() => {
                  alert("로그아웃되었습니다.");
                  setLogined(false);
                });
              }}
            >
              로그아웃
            </div>
          )}
        </div>
      </div>
      <div className="header-line"></div>
    </div>
  );
}
