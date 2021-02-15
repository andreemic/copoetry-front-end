// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {Auth0Provider} from "./helpers/react-auth0-spa";
import config from "./helpers/auth_config.json";
import history from "./history";
import Store from "./helpers/anonymous";


import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";


Sentry.init({
    dsn: "https://edfcd183daaf4591afbc5c77f6d907c9@o524924.ingest.sentry.io/5638215",
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});

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
        redirect_uri={"http://localhost:3000"}
        audience={config.audience}
        onRedirectCallback={onRedirectCallback}
    >
        <Store>
            <App/>
        </Store>
    </Auth0Provider>,
    document.getElementById("root")
);
