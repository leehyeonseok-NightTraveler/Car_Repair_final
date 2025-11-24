import React, { useEffect, useState } from "react";
import axios from "axios";

function NoticeList() {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8484/api/notice_list")
            .then(response => {
                setNotices(response.data.list); // list 배열만 가져오기
            })
            .catch(error => {
                console.error("데이터 불러오기 실패:", error);
            });
    }, []);

    return (
        <div>
            <h2>공지사항 목록</h2>
            <table border="1">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                </tr>
                </thead>
                <tbody>
                {notices.map(notice => (
                    <tr key={notice.notice_no}>
                        <td>{notice.notice_no}</td>
                        <td>{notice.notice_title}</td>
                        <td>{notice.notice_writer}</td>
                        <td>{notice.notice_created}</td>
                        <td>{notice.notice_views}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default NoticeList;
