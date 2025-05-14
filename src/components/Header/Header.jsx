import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "./Header.scss";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <nav className="container">
        <Link className="logo" to="/">
          RoomRental
        </Link>

        <ul>
          {user && (
            <li>
              <Link to="/rooms">Rooms</Link>
            </li>
          )}

          {!user ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>Hello, {user.name}</li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
