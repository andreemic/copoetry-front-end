import React, {useContext, useEffect, useState} from "react"
import {useAuth0} from "../../helpers/react-auth0-spa";
import 'materialize-css';
import './header.css';
import {NavLink} from "react-router-dom";
import {useApi} from "../../helpers/api";
import {Context} from "../../helpers/anonymous";

function Header() {
    const {isAuthenticated, logout, user} = useAuth0();
    const {updateNeedsToVote} = useApi();
    const [state, dispatch] = useContext(Context);


    useEffect(updateNeedsToVote, [user]);

    return <section className="header">
        <span className="header-links">
            {/*{<NavLink to="/read" activeClassName="selected">read</NavLink>}*/}
            {isAuthenticated && <NavLink to="/write" activeClassName="selected">write</NavLink>}
            {isAuthenticated && <NavLink to="/my_poems" activeClassName="selected" className={state.needsToVote ? "notif" : ""}>my poems</NavLink>}
        </span>

        {isAuthenticated && <span className="header-user-area">
            <span className={"anonymous-toggler " + (state.anonymous
                ? "anonymous" : "")} onClick={() => dispatch({type: 'TOGGLE_ANONYMOUS'})}/>
            <span className="header-logout-label">Not <span className="username">{user.nickname}</span>?</span>
            <span className="small-boxy small-boxy-btn header-logout-btn" onClick={logout}>Log Out</span>
            <span className="header-logout-mobile material-icons" onClick={logout}>logout</span>
        </span>}

    </section>
}

export default Header;
