// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "./helpers/react-auth0-spa";
import config from "./helpers/auth_config.json";
import history from "./history";

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
    history.push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};

// Wrap App in the Auth0Provider component
// The domain and client_id values will be found in your Auth0 dashboard
ReactDOM.render(
    <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        redirect_uri={process.env.REACT_APP_AUTH0_CALLBACK_URL}
        audience={config.audience}
        onRedirectCallback={onRedirectCallback}
    >
        <App />
    </Auth0Provider>,
    document.getElementById("root")
);
