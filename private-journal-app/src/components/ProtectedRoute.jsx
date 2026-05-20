import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return (
      <main className="page">
        <p>Loading...</p>
      </main>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}