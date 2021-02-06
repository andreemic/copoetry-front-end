import React, {useState} from "react"
import {useAuth0} from "../../helpers/react-auth0-spa";
import {Redirect} from "react-router-dom"
import {Button} from "react-materialize";
import ParticleEffectButton from 'react-particle-effect-button'

import './welcome.css'

const PARTICLE_DURATION = 700;
function WelcomePage() {
    const {isAuthenticated, loginWithRedirect} = useAuth0();
    let [loginClicked, setLoginClicked] = useState();

    function loginClick() {
        setLoginClicked(true);
        setTimeout(loginWithRedirect, PARTICLE_DURATION * 0.5)
    }

    if (isAuthenticated)
        return <Redirect to='/write'/>
    return <div className="welcome-con">
        <h2>"None of us is as smart as all of us." <span>—&nbsp;&nbsp;&nbsp;Ken Blanchard</span></h2>
        <p>You add a line, she adds a line... See what you can create.</p>
        <ParticleEffectButton color='#A2D2FF' hidden={loginClicked}
        duration={PARTICLE_DURATION} direction="top" className="welcome-login-btn-con">
            <button className="welcome-login-btn" onClick={loginClick}>LOG IN VIA AUTH0</button>
        </ParticleEffectButton>
    </div>;
}

export default WelcomePage;
