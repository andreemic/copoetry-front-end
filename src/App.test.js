import Poem from "./components/Poem/Poem";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import config from "./helpers/auth_config.json";
import {Auth0Provider} from "./helpers/react-auth0-spa";
import Store from "./helpers/anonymous";
const redirectCB = (e) => {
    console.log(e)
}
it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Store>
        <Auth0Provider
            domain={config.domain}
            client_id={config.clientId}
            redirect_uri={process.env.REACT_APP_BASEURL}
            audience={config.audience}
            onRedirectCallback={redirectCB}
        >
            <App/>
        </Auth0Provider>
    </Store>, div);
    ReactDOM.unmountComponentAtNode(div);
});
