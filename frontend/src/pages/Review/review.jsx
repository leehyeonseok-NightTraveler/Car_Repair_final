import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRating from "./StarRating";   // ← ⭐ 별점 컴포넌트 가져오기
import "./review.css";

export default function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const rsvNo = 3;
  const storeId = "yyy";

  // ⭐ 테스트용 자동 로그인
  useEffect(() => {
    async function testLogin() {
      try {
        await axios.post(
          "http://localhost:8484/api/storeLogin",
          {
            storeId: "yyy",
            password: "1234",
          },
          { withCredentials: true }
        );
        console.log("⭐ 테스트 로그인 성공");
      } catch (err) {
        console.error("테스트 로그인 실패", err);
      }
    }

    testLogin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=== Review Submit Data ===");
    console.log("rsvNo:", rsvNo);
    console.log("storeId:", storeId);
    console.log("rating:", rating);
    console.log("content:", content);
    console.log("==========================");

    try {
      const res = await axios.post(
        "http://localhost:8484/api/review/add",
        {
          rsvNo,
          storeId,
          rating: Number(rating),
          content,
        },
        { withCredentials: true }
      );

      alert("리뷰 등록 완료!");

      setRating(0);
      setContent("");
    } catch (err) {
      console.error("리뷰 등록 실패:", err);

      if (err.response) {
        alert(err.response.data);
      } else {
        alert("리뷰 등록 실패");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h2 className="review-title">
        {storeId} 리뷰 작성 (예약번호: {rsvNo})
      </h2>

      <label className="review-label">별점</label>

      {/* ⭐ 별점 컴포넌트 */}
      <StarRating value={rating} onChange={setRating} />

      <label className="review-label">내용</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="review-textarea"
      />

      <button type="submit" className="review-button">등록하기</button>
    </form>
  );
}
