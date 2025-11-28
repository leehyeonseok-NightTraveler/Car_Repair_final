import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = sessionStorage.getItem("accountId");

  if (!isLoggedIn) {
    alert("보안 정책에 의해 보호된 페이지입니다.\n로그인이 필요합니다.");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;   // ⭐ 이게 있어야 안쪽 Route들이 렌더됨
};

export default ProtectedRoute;
