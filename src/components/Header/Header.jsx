import React from "react";
import { Link } from "react-router-dom";
import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <nav className="container">
        <Link className="logo" to="/">
          RoomRental
        </Link>
        <ul>
          <li>
            <Link to="/rooms">Rooms</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
