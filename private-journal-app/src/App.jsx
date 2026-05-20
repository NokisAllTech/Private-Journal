import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return (
      <main className="landing">
        <h1>Loading...</h1>
      </main>
    );
  }

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <main className="landing">
      <section className="hero-card">
        <p className="eyebrow">Private Full-Stack Journal</p>

        <h1>Write privately. Reflect daily. Sync everywhere.</h1>

        <p>
          A secure journal app powered by Firebase Authentication and Firestore.
          Your entries stay connected to your account only.
        </p>

        <div className="button-row">
          <Link className="button primary" to="/register">
            Create account
          </Link>

          <Link className="button secondary" to="/login">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}