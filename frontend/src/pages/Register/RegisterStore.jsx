// src/RegisterStore.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; // ★ 똑같은 CSS를 재사용해서 디자인 통일

function RegisterStore() {
  const navigate = useNavigate();

  // 업체용 데이터 상태 관리
  const [formData, setFormData] = useState({
    storeId: '',
    password: '',
    email: '',
    phoneNumber: '',
    address: '',
    dayType: '평일', // 기본값
    startTime: '',
    endTime: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // ★ 스프링 부트에 만들 'StoreRegisterController' 주소로 보냄
      const response = await fetch("http://localhost:8484/api/registerstore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (await response.text() === "success") {
        alert("🏢 업체 가입 신청이 완료되었습니다!");
        navigate("/");
      } else {
        alert("가입 실패");
      }
    } catch (error) {
      console.error(error);
      alert("서버 연결 실패");
    }
  };

  return (
    <div className="register-container">
      {/* 탭 메뉴 (이번엔 업체 쪽이 active) */}
      <div className="register-tabs">
        <Link to="/register">일반 회원가입</Link>
        <Link to="/registerstore" className="active">업체 회원가입</Link>
      </div>

      <h1>업체 회원가입</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>업체 아이디</label>
          <input type="text" name="storeId" onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>비밀번호</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>업체 이메일</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>업체 전화번호</label>
          <input type="text" name="phoneNumber" placeholder="010-1234-5678" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>업체 주소</label>
          <input type="text" name="address" onChange={handleChange} required />
        </div>

        {/* 영업 시간 (JSP의 select + input 구조 반영) */}
        <div className="form-group">
            <label>영업 시간</label>
            <div className="form-time-group">
                <select name="dayType" className="time-select" onChange={handleChange} value={formData.dayType}>
                    <option value="평일">평일</option>
                    <option value="주말">주말</option>
                    <option value="연중무휴">연중무휴</option>
                </select>
                
                <input type="number" name="startTime" className="time-input" min="0" max="23" placeholder="09" onChange={handleChange} required />
                <span className="time-unit">시 부터</span>
                
                <input type="number" name="endTime" className="time-input" min="0" max="23" placeholder="18" onChange={handleChange} required />
                <span className="time-unit">시 까지</span>
            </div>
        </div>

        <div className="form-group">
            <label>업체 상세 소개</label>
            <textarea name="description" rows="4" placeholder="정비소 소개를 적어주세요..." onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="submit-button">업체 가입하기</button>
      </form>
    </div>
  );
}

export default RegisterStore;