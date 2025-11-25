// // src/components/InquiryFloating.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import "./InquiryFloating.css"
//
// export default function InquiryFloating({ role }) {
//     return (
//         <div className="floating-wrapper">
//             <div className="floating-menu">
//                 {(role === "USER" || role === "STORE") && (
//                     <>
//                         <Link to="/inquiry/inquiry_write">1:1 문의</Link>
//                         <Link to="/inquiry/inquiry_history">내 문의 내역</Link>
//                     </>
//                 )}
//                 {role === "ADMIN" && (
//                     <Link to="/inquiry/inquiry_manage">문의 관리</Link>
//                 )}
//             </div>
//         </div>
//     );
// }


// src/components/InquiryFloating.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./InquiryFloating.css"

export default function InquiryFloating({ role }) {
    // role 변수를 사용하지 않고 모든 링크를 항상 렌더링합니다.
    return (
        <div className="floating-wrapper">
            <div className="floating-menu">
                {/* 1:1 문의와 내 문의 내역은 모든 사용자에게 노출 */}
                <Link to="inquiry_write">1:1 문의</Link>
                <Link to="inquiry_history">내 문의 내역</Link>

                {/* 문의 관리는 관리자 권한 없이도 일단 노출.
                   실제 접근 통제는 서버 또는 라우터 단에서 이루어져야 합니다. */}
                <Link to="inquiry_manage">문의 관리</Link>
            </div>
        </div>
    );
}