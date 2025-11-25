import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import "../../components/common/mainpage.css";
import "./storeLogin.css";

function StoreLogin() {
    const [storeId, setStoreId] = useState("");
    const [password, setPassword] = useState("");
    const [saveId, setSaveId] = useState(false);
    const [loginFailMsg, setLoginFailMsg] = useState("");

    // 쿠키 읽기
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const setCookie = (name, value, days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
    };

    const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/`;
    };

    useEffect(() => {
        const saved = getCookie("savedStoreId");
        if (saved) {
            setStoreId(saved);
            setSaveId(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (storeId.trim() === "") {
            alert("아이디를 입력하세요.");
            return;
        }
        if (password.trim() === "") {
            alert("비밀번호를 입력하세요.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8484/api/storeLogin",
                { storeId, password },
                { withCredentials: true }
            );

            if (res.data.success) {
                if (saveId) setCookie("savedStoreId", storeId, 7);
                else deleteCookie("savedStoreId");

                window.location.href = "/";
            } else {
                setLoginFailMsg(res.data.message || "로그인 실패");
            }
        } catch (err) {
            setLoginFailMsg("서버 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <Header />

            <main>
                <form onSubmit={handleSubmit}>
                    <table border="1" align="center" className="table1">
                        <caption>
                            <h1 className="cap">업체 로그인</h1>
                            <p className="p1">정비소 업체 계정으로 로그인 하세요.</p>
                        </caption>

                        <tbody>
                            {/* 탭 */}
                            <tr className="tab-links-row">
                                <td className="tab-cell">
                                    <a href="/login" className="pw_text">회원 로그인</a>
                                </td>
                                <td className="tab-cell">
                                    <a className="id_text">업체 로그인</a>
                                </td>
                            </tr>

                            {/* 업체 아이디 */}
                            <tr>
                                <td colSpan="3">
                                    <input
                                        className="mem"
                                        type="text"
                                        placeholder="아이디를 입력하세요"
                                        value={storeId}
                                        onChange={(e) => setStoreId(e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* 비밀번호 */}
                            <tr>
                                <td colSpan="3">
                                    <input
                                        className="mem"
                                        type="password"
                                        placeholder="비밀번호를 입력하세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </td>
                            </tr>

                            {/* 아이디 저장 */}
                            <tr>
                                <td colSpan="3">
                                    <label className="fake-check">
                                        <input
                                            type="checkbox"
                                            checked={saveId}
                                            onChange={(e) => setSaveId(e.target.checked)}
                                        />
                                        <span className="custom-check checked"></span>
                                        <p className="chek_text">아이디 저장</p>
                                    </label>
                                </td>
                            </tr>

                            {/* 에러 메시지 */}
                            <tr>
                                <td colSpan="3" className="td1">
                                    <div className="lockTime">
                                        {loginFailMsg ? loginFailMsg : <>&nbsp;</>}
                                    </div>
                                </td>
                            </tr>

                            {/* 로그인 버튼 */}
                            <tr>
                                <td colSpan="3" className="login_btn">
                                    <input type="submit" value="로그인" id="login2" />
                                </td>
                            </tr>

                            {/* 기타 링크 */}
                            <tr>
                                <td className="btn3" colSpan="3">
                                    <a href="/findStoreAccount" className="link">아이디 찾기</a>
                                    &nbsp;&nbsp;/&nbsp;&nbsp;
                                    <a href="/findStorePW" className="link">비밀번호 찾기</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </main>

            <Footer />
        </>
    );
}

export default StoreLogin;
