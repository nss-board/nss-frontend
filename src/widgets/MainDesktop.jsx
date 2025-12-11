import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dummyPosts } from "../dummy";

export default function HeaderDesktop() {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedPosts, setSortedPosts] = useState([]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    // 이거 서버에서 불러오는거 따로 빼야함
    try {
      const articleList = fetch("//134.185.118.29:8080/post/list ", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);

          result = [...result].sort((a, b) => {
            return sortOrder === "asc"
              ? new Date(a.createdAt) - new Date(b.createdAt)
              : new Date(b.createdAt) - new Date(a.createdAt);
          });

          result = result.map((item) => {
            const d = new Date(item.createdAt);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            const hour = String(d.getHours()).padStart(2, "0");
            const minute = String(d.getMinutes()).padStart(2, "0");

            return {
              ...item,
              createdAt: `${year}-${month}-${day} ${hour}:${minute}`,
            };
          });

          setSortedPosts(result);
        });

      console.log(articleList);
    } catch (error) {
      console.error(error);
    }
  }, [sortOrder]);

  // 정렬

  // setSortedPosts();
  // [...dummyPosts].sort((a, b) => {
  //   return sortOrder === "asc"
  //     ? new Date(a.createdAt) - new Date(b.createdAt)
  //     : new Date(b.createdAt) - new Date(a.createdAt);
  // });

  return (
    <div className="main-wrapper">
      <div className="sub-header-wrapper">
        <div className="sort-wrapper">
          <img
            src="/sort.svg"
            className="sort-icon"
            onClick={toggleSortOrder}
          />
          <div className="sort-classify">
            {sortOrder === "asc" ? "오름차순" : "내림차순"}
          </div>
        </div>
        <div className="page-controller-wrapper"></div>
      </div>

      <div className="main-content-wrapper-foralign">
        <div className="content-table-wrapper">
          {sortedPosts.map((post) => (
            <Link to={`/article/${post.id}`} key={post.id}>
              <div className="content-wrapper">
                <div className="content-box">
                  <div className="content-preview-image-wrapper">
                    {/* <img
                      src={post.thumbnail}
                      className="content-preview-image"
                      alt="thumbnail"
                    /> */}
                    {post.thumbnail !== "" ? (
                      <img
                        src={post.thumbnail}
                        className="content-preview-image"
                        alt="thumbnail"
                      />
                    ) : null}
                  </div>
                  <div className="content-preview-content-wrapper">
                    <div className="content-preview-dividewrapper">
                      <div className="content-title">{post.title}</div>
                      <div className="content-desc">{post.content}</div>
                    </div>
                    <div className="content-footer-wrapper">
                      <div className="content-footer-top">
                        <div className="content-footer-content">
                          {post.createdAt.split(" ")[0]} -{" "}
                          {post.comments.length}개의 댓글 - {post.likes.length}
                          개의 좋아요
                        </div>
                        <div className="content-footer-content">
                          by {post.writer}
                        </div>
                      </div>
                      <div className="content-footer-bottomline" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
