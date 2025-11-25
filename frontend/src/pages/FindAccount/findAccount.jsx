import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import "../../components/common/mainpage.css";
import "./findAccount.css";

function FindAccount() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8484/api/findAccount", {
                email: email,
                phone: phone,
            });

            if (response.data.success) {
                alert("아이디가 이메일로 발송되었습니다.");
            } else {
                alert("계정 정보를 찾지 못했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <Header />

            <main>
                <form onSubmit={handleSubmit}>
                    <table className="table1">
                        <tr>
                            <td className="trh1" colSpan="3">
                                <p>아이디 찾기</p>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="3" className="td1">
                                <p>아래 정보를 입력하시면 아이디를 메일로 발송해 드립니다.</p>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="3">
                                <input
                                    className="email"
                                    type="text"
                                    placeholder="이메일"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="3">
                                <input
                                    className="phone"
                                    type="text"
                                    placeholder="전화번호"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="3">
                                <input className="find2" type="submit" value="확인" />
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="3">
                                <input
                                    className="btn2"
                                    type="button"
                                    value="로그인 페이지 이동"
                                    onClick={() => (window.location.href = "/login")}
                                />
                            </td>
                        </tr>

                        <tr className="lastTr">
                            <td className="btn3">
                                <a href="/findAccount" className="link">아이디 찾기</a>
                                &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
                                <a href="/findPW" className="link">비밀번호 찾기</a>
                                &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
                                <a href="/register" className="link">회원가입</a>
                            </td>
                        </tr>
                    </table>
                </form>
            </main>

            <Footer />
        </>
    );
}

export default FindAccount;
