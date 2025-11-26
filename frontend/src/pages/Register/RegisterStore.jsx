import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Link는 안 써서 뺐습니다.
import './Register.css'; // 공통 CSS 사용

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
    
    // 간단한 유효성 검사
    if (!formData.storeId || !formData.password || !formData.address) {
        alert("필수 정보를 모두 입력해주세요.");
        return;
    }

    try {
      // 스프링 부트 'StoreRegisterController' 주소로 전송
      const response = await fetch("http://localhost:8484/api/registerstore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (await response.text() === "success") {
        alert("🏢 업체 가입 신청이 완료되었습니다! 관리자 승인 후 이용 가능합니다.");
        navigate("/"); // 메인으로 이동
      } else {
        alert("가입 실패: 이미 존재하는 아이디일 수 있습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("서버 연결 실패");
    }
  };

  return (
    <div className="register-container">
      
      {/* 탭 메뉴: 버튼 형시 */}
      <div className="tab-button-group">
        <button 
            className="tab-button" 
            onClick={() => navigate('/register')} // 일반 가입으로 이동
        >
            일반 회원가입
        </button>
        <button 
            className="tab-button active" // 현재 페이지 활성화 (파란색)
            disabled 
        >
            업체 회원가입
        </button>
      </div>

      <h1>업체 회원가입</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="storeId">업체 아이디</label>
          <input 
            type="text" 
            id="storeId"
            name="storeId" 
            placeholder="사용할 업체 아이디"
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input 
            type="password" 
            id="password"
            name="password" 
            placeholder="비밀번호"
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">업체 이메일</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            placeholder="store@example.com"
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">업체 전화번호</label>
          <input 
            type="text" 
            id="phoneNumber"
            name="phoneNumber" 
            placeholder="02-1234-5678" 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">업체 주소</label>
          <input 
            type="text" 
            id="address"
            name="address" 
            placeholder="서울시 강남구..."
            onChange={handleChange} 
            required 
          />
        </div>

        {/* 영업 시간 입력 그룹 */}
        <div className="form-group">
            <label>영업 시간</label>
            <div className="form-time-group">
                <select name="dayType" className="time-select" onChange={handleChange} value={formData.dayType}>
                    <option value="평일">평일</option>
                    <option value="주말">주말</option>
                    <option value="연중무휴">연중무휴</option>
                </select>
                
                <input 
                    type="number" 
                    name="startTime" 
                    className="time-input" 
                    min="0" max="23" 
                    placeholder="09" 
                    onChange={handleChange} 
                    required 
                />
                <span className="time-unit">시 부터</span>
                
                <input 
                    type="number" 
                    name="endTime" 
                    className="time-input" 
                    min="0" max="23" 
                    placeholder="18" 
                    onChange={handleChange} 
                    required 
                />
                <span className="time-unit">시 까지</span>
            </div>
        </div>

        {/* 업체 상세 소개 (넓은 칸) */}
        <div className="form-group">
            <label htmlFor="description">업체 상세 소개</label>
            <textarea 
                id="description"
                name="description" 
                placeholder="정비소의 장점, 경력, 서비스 내용 등을 자세히 적어주세요..." 
                onChange={handleChange}
                // CSS에서 높이를 150px로 잡았기 때문에 rows는 없어도 됩니다.
            ></textarea>
        </div>

        <button type="submit" className="submit-button">업체 가입하기</button>
      </form>
    </div>
  );
}

export default RegisterStore;