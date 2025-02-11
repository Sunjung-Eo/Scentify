import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  condition: boolean; // 접근 조건
  redirectPath: string; // 리디렉션 경로
  children: ReactNode; // 렌더링할 자식 컴포넌트
}

export default function ProtectedRoute({
  condition,
  redirectPath,
  children,
}: ProtectedRouteProps) {
  if (!condition) {
    return <Navigate to={redirectPath} replace />;
  }
  return <>{children}</>;
}
