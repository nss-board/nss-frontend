import { dummyPosts } from "../dummy";
import HeaderDesktop from "./HeaderDesktop";
import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
const compressAndConvertToBase64 = (file) => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 400,
    useWebWorker: true,
  };

  return imageCompression(file, options)
    .then((compressedFile) => {
      return imageCompression.getDataUrlFromFile(compressedFile);
    })
    .then((base64) => {
      return base64;
    });
};

export default function AddDesktop() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // 업로드된 파일
  const [base64Image, setBase64Image] = useState(""); // Base64 저장용
  const [fileName, setFileName] = useState("선택된 파일 없음");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const logined = fetch("//134.185.118.29:8080/user/verify", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.ok) {
          alert("로그인해주세요");
          navigate("/");
        }
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);

      compressAndConvertToBase64(file)
        .then((base64) => {
          setBase64Image(base64);
          console.log("base64 결과:", base64);
        })
        .catch((err) => console.error("압축 오류:", err));
    } else {
      setSelectedFile(null);
      setFileName("선택된 파일 없음");
      setBase64Image("");
    }
  };

  const handleSubmit = () => {
    try {
      console.log("click");
      fetch("//134.185.118.29:8080/post/write", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
          thumbnail: base64Image,
        }),
      }).then((res) => navigate("/"));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="AddpageWrapper">
      <HeaderDesktop />
      <div className="add-page-wrapper">
        <div className="add-page">
          <div className="add-page-context">
            <div className="id-blank-wrapper">
              <div className="login-label">제목</div>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="password-blank-wrapper">
              <div className="login-label">글</div>
              <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="id-blank-wrapper">
              <div className="login-label">썸네일</div>
              <div className="login-label-wrapper">
                <label className="custom-file-upload">
                  파일 선택
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="file-name" id="fileName">
                  {fileName}
                </span>
              </div>
              <div className="add-page-icon-wrapper">
                <img
                  src="/send.svg"
                  className="article-page-comment-sendicon"
                  onClick={handleSubmit}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
