import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import "../../components/common/mainpage.css";
import "./login.css";

function Login() {
    const [accountId, setAccountId] = useState("");
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
        const saved = getCookie("savedId");
        if (saved) {
            setAccountId(saved);
            setSaveId(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (accountId.trim() === "") {
            alert("아이디를 입력하세요.");
            return;
        }
        if (password.trim() === "") {
            alert("비밀번호를 입력하세요.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8484/api/login",
                { accountId, password },
                { withCredentials: true }
            );

            if (res.data.success) {
                if (saveId) setCookie("savedId", accountId, 7);
                else deleteCookie("savedId");

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
                            <h1 className="cap">일반 회원 로그인</h1>
                            <p className="p1">MY CAR 정비소의 서비스를 이용하시려면 로그인 하세요.</p>
                        </caption>

                        {/* ★ React에서는 tbody가 필수 */}
                        <tbody>

                            <tr className="tab-links-row">
                                <td className="tab-cell">
                                    <a className="id_text">회원 로그인</a>
                                </td>
                                <td className="tab-cell">
                                    <a href="/storeLogin" className="pw_text">
                                        업체 로그인
                                    </a>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3">
                                    <input
                                        className="mem"
                                        type="text"
                                        name="accountId"
                                        placeholder="아이디를 입력하세요"
                                        value={accountId}
                                        onChange={(e) => setAccountId(e.target.value)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3">
                                    <input
                                        className="mem"
                                        type="password"
                                        name="password"
                                        placeholder="비밀번호를 입력하세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3">
                                    <label className="fake-check">
                                        <input
                                            type="checkbox"
                                            id="ol_check"   // ★ JSP와 동일한 id 유지
                                            checked={saveId}
                                            onChange={(e) => setSaveId(e.target.checked)}
                                        />
                                        <span className="custom-check checked"></span>
                                        <p className="chek_text">아이디 저장</p>
                                    </label>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3" className="td1">
                                    <div className="lockTime">
                                        {loginFailMsg ? loginFailMsg : <>&nbsp;</>}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3" className="login_btn">
                                    <input type="submit" value="로그인" id="login" />
                                </td>
                            </tr>

                            <tr>
                                <td className="btn3" colSpan="3">
                                    <a href="/findAccount" className="link">아이디 찾기</a>
                                    &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
                                    <a href="/findPW" className="link">비밀번호 찾기</a>
                                    &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
                                    <a href="/register" className="link">회원가입</a>
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

export default Login;
