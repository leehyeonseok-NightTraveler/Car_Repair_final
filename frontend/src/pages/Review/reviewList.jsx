import React, { useEffect, useState } from "react";
import axios from "axios";
import "./reviewList.css";

function Star({ fill, idx }) {
  const clipId = `star-half-${idx}`;

  return (
    <svg
      viewBox="0 0 24 24"
      className="sr-star"
      width="22"
      height="22"
      aria-hidden="true"
      style={{ color: "gold" }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>

      <path
        d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
        fill="none"
        stroke="#ccc"
        strokeWidth="1.5"
      />

      {fill === 1 && (
        <path
          d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
          fill="gold"
        />
      )}

      {fill === 0.5 && (
        <g clipPath={`url(#${clipId})`}>
          <path
            d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
            fill="gold"
          />
        </g>
      )}
    </svg>
  );
}

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let fill = 0;
    if (rating >= i) fill = 1;
    else if (rating >= i - 0.5) fill = 0.5;
    stars.push(<Star key={i} fill={fill} idx={i} />);
  }
  return <div className="star-row">{stars}</div>;
}

export default function ReviewList({ storeId = 33 }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [editOpen, setEditOpen] = useState(null);

  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    async function load() {
      try {
        const listRes = await axios.get(
          `http://localhost:8484/api/review/store/${storeId}`,
          { withCredentials: true }
        );
        setReviews(listRes.data);

        const avgRes = await axios.get(
          `http://localhost:8484/api/review/store/${storeId}/average`,
          { withCredentials: true }
        );
        setAvgRating(avgRes.data);

        const userRes = await axios.get(
          "http://localhost:8484/api/review/session/user",
          { withCredentials: true }
        );
        setCurrentUser(userRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [storeId]);

  const openEdit = (r) => {
    setEditOpen(r.reviewNo);
    setEditContent(r.content);
    setEditRating(r.rating);
  };

  const submitEdit = async (reviewNo) => {
    try {
      await axios.put(
        `http://localhost:8484/api/review/${reviewNo}`,
        { content: editContent, rating: editRating },
        { withCredentials: true }
      );

      alert("수정 완료!");

      // ✔ reload 없이 상태에서 수정 적용
      setReviews((prev) =>
        prev.map((rev) =>
          rev.reviewNo === reviewNo
            ? { ...rev, content: editContent, rating: editRating }
            : rev
        )
      );

      setEditOpen(null);
    } catch (e) {
      console.error(e);
      alert("수정 실패");
    }
  };

  // ⭐⭐⭐ 삭제 기능 추가
  const deleteReview = async (reviewNo) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

	try {
	    await axios.post(
	      "http://localhost:8484/api/review/delete",
	      new URLSearchParams({ reviewNo }),
	      { withCredentials: true }
	    );

      alert("삭제 완료!");

      // ✔ reload 없이 리스트에서 제거
      setReviews((prev) => prev.filter((r) => r.reviewNo !== reviewNo));
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
    }
  };

  if (loading) return <div className="review-message">불러오는 중...</div>;

  return (
    <div className="review-table-container">
      <div className="avg-rating-box">
        <h3>평균 별점</h3>
        {avgRating ? (
          <div className="avg-star-row">
            {renderStars(avgRating)}
            <span className="avg-rating-number">{avgRating.toFixed(1)} / 5.0</span>
          </div>
        ) : (
          <p>평균 별점 없음</p>
        )}
      </div>

      <table className="review-table">
        <thead>
          <tr>
            <th>별점</th>
            <th>작성자</th>
            <th>내용</th>
            <th>작성일</th>
          </tr>
        </thead>

        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="4" className="review-message">
                등록된 리뷰가 없습니다.
              </td>
            </tr>
          ) : (
            reviews.map((r) => (
              <React.Fragment key={r.reviewNo}>
                <tr>
                  <td className="star-cell">
                    <div className="star-with-score">
                      {renderStars(r.rating)}
                      <span className="rating-number">{r.rating}점</span>
                    </div>
                  </td>

                  <td className="review-accountId-cell">{r.accountId}</td>

                  <td className="review-content-cell">
                    {r.content}

                    {currentUser && r.accountId === currentUser && (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => openEdit(r)}
                        >
                          수정
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteReview(r.reviewNo)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </td>

                  <td>{r.createdDate}</td>
                </tr>

                {editOpen === r.reviewNo && (
                  <tr className="edit-row">
                    <td colSpan="4">
                      <div className="edit-box">
                        <h4>리뷰 수정</h4>

                        <label>별점</label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.5"
                          value={editRating}
                          onChange={(e) => setEditRating(e.target.value)}
                        />

                        <label>내용</label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />

                        <button
                          className="save-btn"
                          onClick={() => submitEdit(r.reviewNo)}
                        >
                          저장
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={() => setEditOpen(null)}
                        >
                          취소
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
