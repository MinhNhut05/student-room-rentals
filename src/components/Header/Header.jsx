import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "./Header.scss";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <nav className="header__nav">
          <Link to="/" className="logo">
            RoomRentals
          </Link>
          <ul>
            <li>
              <Link to="/rooms">Rooms</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/post-room">Post Room</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
