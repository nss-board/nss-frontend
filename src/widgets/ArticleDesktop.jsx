import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import HeaderDesktop from "./HeaderDesktop";

export default function ArticleDesktop() {
  const { id } = useParams();
  console.log(id);
  const [post, setPost] = useState({
    comments: [],
    likes: [],
  });
  const [liked, setLiked] = useState(false);
  const [heartCount, setHeartCount] = useState(0);
  const [comment, setComment] = useState([]);
  const [user, setUser] = useState("로그인하세요");
  const [ip, setIp] = useState("");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip);
      });
  }, []);

  useEffect(() => {
    console.log("변경된 post");
    console.log(post.comments);

    setHeartCount(post.likes.length);

    if (post.comments.length != 0) {
      try {
        fetch("/api/post/comment", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, comments: post.comments }),
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [post]);

  useEffect(() => {
    try {
      const temp = fetch(
        "/api/post/giveMeOnlyADetailedPostWithIdWhichIsProvidedFromUser/" + id,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((result) => {
          const d = new Date(result.createdAt);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          const hour = String(d.getHours()).padStart(2, "0");
          const minute = String(d.getMinutes()).padStart(2, "0");

          result.createdAt = `${year}-${month}-${day} ${hour}:${minute}`;
          if (!result.comments) result.comments = [];
          setPost(result);

          let c = false;
          for (let i = 0; i < result.likes.length; i++) {
            if (result.likes[i].user == user) {
              check = true;
            }
          }

          if (c) {
            setLiked(true);
          }
        });
    } catch (error) {
      console.error(error);
    }

    fetch("/api/user/verify", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result.id);
      });
  }, []);

  const handleHeartClick = () => {
    // setHeartCount(post.likes.length);
    if (!liked) {
      setLiked(true);
      fetch("/api/post/like", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, user: user ? user : ip }),
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setHeartCount((prev) => prev + 1);
          // if (result.status) {
          //   setPost((prev) => ({
          //     ...prev,
          //     likes: [...prev.likes, { user: user ? user : ip }],
          //   }));
          // }
        });
    }
    // else {
    //   setLiked(false);
    //   setHeartCount((prev) => prev - 1);
    // }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      writer: user
        ? user
        : "ㅇㅇ (" + ip.split(".").slice(0, 2).join(".") + ")",
      content: comment,
      createdAt: new Date().toISOString(),
    };

    setPost((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }));

    setComment("");
  };

  if (!post) return <div>포스트를 찾을 수 없습니다</div>;

  return (
    <div className="ArticlePageWrapper">
      <HeaderDesktop />

      <div className="article-page-wrapper">
        <div className="article-page-title">{post.title}</div>

        <div className="article-page-desc-wrapper">
          <div className="article-page-desc-lefttext">{post.createdAt}</div>
          <div className="article-page-desc-centerbar">|</div>
          <div className="article-page-desc-righttext">by. {post.writer}</div>
        </div>

        <div className="article-page-context">{post.content}</div>

        <div className="article-page-menu-wrapper">
          <img src="/comment.svg" className="article-page-icon" />
          <div className="article-page-comment-number">
            {post.comments.length}
          </div>
          <img
            src="/heart-blank.svg" // } {liked ? "/heart-fill.svg" :
            className="article-page-icon"
            onClick={handleHeartClick}
            style={{ cursor: "pointer" }}
          />
          <div className="article-page-heart-number">{heartCount}</div>{" "}
          {/* {post.likes} */}
          {/* 좋아요 변경 처리 필요 (서버 업로드) */}
        </div>
        <div className="aritlce-page-comment-wrapper">
          <div className="aritlce-page-comment-wrapper">
            <div className="article-page-comment-header">
              <div className="article-page-comment-title">댓글</div>
              <div className="article-page-comment-title-underline" />
            </div>

            {post.comments.length === 0 ? (
              <div className="article-page-comment-empty">
                아직 댓글이 없습니다.
              </div>
            ) : (
              post.comments.map((comment, index) => (
                <div
                  key={index}
                  className="article-page-comment-content-wrapper"
                >
                  <div className="article-page-comment-author">
                    {comment.writer}
                  </div>
                  <div className="article-page-comment-content">
                    <pre>{comment.content}</pre>
                  </div>
                </div>
              ))
            )}
            <div className="article-page-comment-add-wrapper">
              <div className="article-page-comment-author">{user}</div>
              <div className="article-page-comment-context">
                <textarea
                  type="text"
                  placeholder="훈훈한 댓글 부탁드립니다."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="article-page-comment-context-input"
                />
              </div>
              <div className="article-page-comment-send-wrapper">
                <img
                  src="/send.svg"
                  className="article-page-comment-sendicon"
                  onClick={handleAddComment}
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
