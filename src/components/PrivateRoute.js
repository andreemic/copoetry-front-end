// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
// Source: https://stackoverflow.com/questions/47476186/when-user-is-not-logged-in-redirect-to-login-reactjs
import React from 'react'
import { useAuth0 } from '../react-auth0-spa'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {

    // Add your own authentication on the below line.
    const { isAuthenticated } = useAuth0()

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/welcome', state: { from: props.location } }} />
                )
            }
        />
    )
}

export default PrivateRoute
