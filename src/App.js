import React, {lazy, Suspense, useContext} from "react";
import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {useAuth0} from "./helpers/react-auth0-spa";
import {ThreeDots} from '@agney/react-loading';

import 'react-toastify/dist/ReactToastify.css';
import {Context} from "./helpers/anonymous"
import "feeder-react-feedback/dist/feeder-react-feedback.css";
import PrivateRoute from "./components/PrivateRoute";
import Header from './components/Header/Header'
import {ErrorBoundary} from "@sentry/react";
import SomethingWentWrong from "./components/SomethingWentWrong/SomethingWentWrong";
import PageNotFound from "./components/PageNotFound/PageNotFound";

const ToastContainer = lazy(async () => {
    const {ToastContainer} = await import('react-toastify');
    return {default: ToastContainer};
});
const Slide = lazy(async () => {
    const {Slide} = await import('react-toastify');
    return {default: Slide};
});
const Feedback = lazy(() => import("feeder-react-feedback"))
const Background = lazy(() => import("./components/Background/Background"));

const WritePage = lazy(() => import('./components/WritePage/WritePage'))
const MyPoemsPage = lazy(() => import('./components/MyPoemsPage/MyPoemsPage'))
const PoemPage = lazy(() => import("./components/PoemPage/PoemPage"));
const WelcomePage = lazy(() => import("./components/WelcomePage/WelcomePage"))

function App() {
    const {loading, isAuthenticated} = useAuth0();
    const [state] = useContext(Context);

    return <div className={"app-con " + (state.anonymous ? "darkmode" : "")}>
        {isAuthenticated && <Suspense fallback={<span/>}>
            <Feedback projectId="602adc27a8a0030004764598" primaryColor={state.anonymous ? "#000" : "#fdc6db"}
                      hoverBorderColor={"#bde0feff"} zIndex={"51"}/>
        </Suspense>}
        <Suspense fallback={<div className={"fake-bg"}/>}><Background/></Suspense>
        {loading ? <ThreeDots className="big-loader" width="100"/> :
            <div className="app-wrapper">
                <BrowserRouter>
                    <Suspense fallback={<ThreeDots className="big-loader" width="100"/>}>
                        {isAuthenticated && <Header/>}
                        <ErrorBoundary fallback={SomethingWentWrong}>

                            <Switch>
                                <Route exact path={'/'}>
                                    <Redirect to={isAuthenticated ? '/write' : '/welcome'}/>
                                </Route>
                                <Route exact path='/welcome' component={WelcomePage}/>
                                <PrivateRoute exact path='/write' component={WritePage}/>

                                <PrivateRoute exact strict path='/my_poems/:poemid' component={PoemPage}/>
                                <PrivateRoute exact path='/my_poems' component={MyPoemsPage}/>

                                <Route component={PageNotFound}/>
                            </Switch>
                        </ErrorBoundary>
                    </Suspense>
                </BrowserRouter>
            </div>
        }
        <Suspense fallback={<span/>}>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
            />
        </Suspense>
    </div>;
}

export default App;
