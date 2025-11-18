import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <h1>Bug Tracker</h1>
      <nav className="nav-links">
        <Link to="/">All Bugs</Link>
        <Link to="/bugs/new">Report Bug</Link>
      </nav>
    </header>
  );
};

export default Header;
