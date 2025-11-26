/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

import "../../components/common/mainpage.css";
import "../../components/common/mypage_common.css";
import "./useredit.css";

function UserMypage() {

  const [user, setUser] = useState({});
  const [carList, setCarList] = useState([]);
  const [inquiryList, setInquiryList] = useState([]);
  const [pageMaker, setPageMaker] = useState(null);


  // ■ 유저, 차량, 문의 내역 모두 로드
  const loadUserData = async () => {
    const res = await axios.get("/api/mypage/user/info");
    setUser(res.data.user);
    setCarList(res.data.carList);
    setInquiryList(res.data.inquiryList);
    setPageMaker(res.data.pageMaker);
  };

  /* 처음 로딩 시 데이터 조회 */
  useEffect(() => {
    loadUserData();
  }, []);
  
  // ■ 차량 등록
  const addCar = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const data = {
      car_number: form.get("car_number"),
      car_model: form.get("car_model"),
      car_type: form.get("car_type")
    };

    await axios.post("/api/mypage/user/addCar", data);
    loadUserData();
  };

  // ■ 차량 삭제
  const deleteCar = async (car_number) => {
    if (!window.confirm(`${car_number} 차량을 삭제하시겠습니까?`)) return;

    await axios.delete(`/api/mypage/user/deleteCar/${car_number}`);
    loadUserData();
  };

  // ■ 페이징 이동
  const changePage = async (pageNum) => {
    const res = await axios.get(`/api/mypage/user/info?pageNum=${pageNum}`);
    setInquiryList(res.data.inquiryList);
    setPageMaker(res.data.pageMaker);
  };

  return (
    <>
      <Header />

      <div className="mypage-body">

        {/* 타이틀 */}
        <div className="mypage-title">
          <h2>마이페이지</h2>
          <p>회원님의 등록 차량과 문의 내역, 계정 정보를 확인하세요.</p>
        </div>

        {/* ===== 내 정보 ===== */}
        <section className="mypage-section">
          <h3>내 정보</h3>
          <table className="info-table">
            <tbody>
              <tr><th>이름</th><td>{user.userName}</td></tr>
              <tr><th>이메일</th><td>{user.email}</td></tr>
              <tr><th>전화번호</th><td>{user.phoneNumber}</td></tr>
              <tr><th>가입일</th><td>{user.regDate}</td></tr>
            </tbody>
          </table>

          <button className="btn-normal" onClick={() => window.location.href = "/mypage/user/edit"}>
            정보 수정
          </button>
        </section>

        {/* ===== 차량 등록 ===== */}
        <section className="mypage-section">
          <h3>내 차량 관리</h3>

          <form onSubmit={addCar} className="car-form">
            <table className="info-table">
              <tbody>
                <tr>
                  <th>차량번호</th>
                  <td><input type="text" name="car_number" required /></td>
                </tr>
                <tr>
                  <th>차량모델</th>
                  <td><input type="text" name="car_model" required /></td>
                </tr>
                <tr>
                  <th>차량종류</th>
                  <td>
                    <select name="car_type" required>
                      <option value="">선택</option>
                      <option value="국산">국산</option>
                      <option value="해외">해외</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit" className="btn-normal">차량 등록</button>
          </form>

          {/* 차량 리스트 출력 */}
          {carList.length > 0 ? (
            <table className="data-table" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>차량번호</th>
                  <th>차량모델</th>
                  <th>차량종류</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {carList.map((car) => (
                  <tr key={car.car_number}>
                    <td>{car.car_number}</td>
                    <td>{car.car_model}</td>
                    <td>{car.car_type}</td>
                    <td>
                      <button className="btn-sub" onClick={() => deleteCar(car.car_number)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>등록된 차량이 없습니다.</p>
          )}
        </section>

        {/* ===== 문의 내역 ===== */}
        <section className="mypage-section">
          <h3>1:1 문의 내역</h3>

          {inquiryList.length > 0 ? (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>상태</th>
                    <th>보기</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiryList.map((q) => (
                    <tr key={q.inquiry_no}>
                      <td>{q.inquiry_no}</td>
                      <td>{q.inquiry_title}</td>
                      <td>{q.inquiry_created}</td>
                      <td>{q.inquiry_status}</td>
                      <td>
                        <a className="btn-sub" href={`/inquiry/${q.inquiry_no}`}>상세보기</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 페이지네이션 */}
              <nav className="pagination-container">
                <ul className="pagination-list">
                  {pageMaker?.prev && (
                    <li className="pagination-item">
                      <button onClick={() => changePage(pageMaker.startPage - 1)}>이전</button>
                    </li>
                  )}

                  {Array.from({ length: pageMaker.endPage - pageMaker.startPage + 1 }, (_, i) => {
                    const num = pageMaker.startPage + i;
                    return (
                      <li key={num} className={`pagination-item ${pageMaker.cri.pageNum === num ? "active" : ""}`}>
                        <button onClick={() => changePage(num)}>{num}</button>
                      </li>
                    );
                  })}

                  {pageMaker?.next && (
                    <li className="pagination-item">
                      <button onClick={() => changePage(pageMaker.endPage + 1)}>다음</button>
                    </li>
                  )}
                </ul>
              </nav>
            </>
          ) : (
            <p>등록된 문의 내역이 없습니다.</p>
          )}

        </section>

      </div>

      <Footer />
    </>
  );
}

export default UserMypage;
