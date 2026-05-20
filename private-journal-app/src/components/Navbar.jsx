import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link className="brand" to="/dashboard">
        Private Journal
      </Link>

      <div className="nav-right">
        <span className="user-email">{currentUser?.email}</span>

        <Link className="nav-link" to="/new">
          New Entry
        </Link>

        <button className="small-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}