import React from "react"
import {useAuth0} from "../../react-auth0-spa";
import 'materialize-css';
import './header.css';
import {Link, NavLink} from "react-router-dom";

function Header() {

    const {isAuthenticated, logout, user} = useAuth0();
    return <section className="header">
        <span className="header-links">
            <NavLink to="/read" activeClassName="selected">read</NavLink>
            {isAuthenticated && <NavLink to="/write" activeClassName="selected">write</NavLink>}
            {isAuthenticated && <NavLink to="/my_poems" activeClassName="selected">my poems</NavLink>}
        </span>

        {isAuthenticated && <span className="header-user-area">
            <span className="header-logout-label">Not <span className="username">{user.nickname}</span>?</span>
            <span className="header-logout-btn" onClick={logout}>Log Out</span>
        </span>}

    </section>
}

export default Header;
