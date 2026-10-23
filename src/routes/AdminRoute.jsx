import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function AdminRoute({ children, me }) {
    const currentUser = me || getUser();
    if (!currentUser) return null;
    if (currentUser.role !== "admin") return <Navigate to="/student" replace />;
    return children;
}
