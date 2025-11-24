// src/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; // ★ 위에서 만든 CSS 파일 불러오기

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '', accountId: '', password: '', email: '', phoneNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 유효성 검사 생략 (필요시 추가)

    try {
      const response = await fetch("http://localhost:8484/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (await response.text() === "success") {
        alert("🎉 일반 회원가입 성공!");
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
      {/* 탭 메뉴 */}
      <div className="register-tabs">
        <Link to="/register" className="active">일반 회원가입</Link>
        <Link to="/registerstore">업체 회원가입</Link>
      </div>

      <h1>일반 회원가입</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>이름</label>
          <input type="text" name="userName" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>아이디</label>
          <input type="text" name="accountId" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>휴대폰 번호</label>
          <input type="text" name="phoneNumber" placeholder="010-1234-5678" onChange={handleChange} required />
        </div>

        <button type="submit" className="submit-button">가입하기</button>

        <p className="link-text">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;