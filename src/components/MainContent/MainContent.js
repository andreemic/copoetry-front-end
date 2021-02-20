import React, {lazy} from "react";
import PrivateRoute from "../PrivateRoute";
import PageNotFound from "../PageNotFound/PageNotFound";
import {
    Switch,
    Route
} from "react-router-dom";


const WritePage = lazy(() => import('../WritePage/WritePage'))
const MyPoemsPage = lazy(() => import('../MyPoemsPage/MyPoemsPage'))
const PoemPage = lazy(() => import("../PoemPage/PoemPage"));
const WelcomePage = lazy(() => import("../WelcomePage/WelcomePage"))


function MainContent() {
    return <main><Route render={({location}) => (
        <Switch location={location}>
            <Route exact path='/welcome' component={WelcomePage}/>
            <PrivateRoute exact path='/write' component={WritePage}/>

            <PrivateRoute exact strict path='/my_poems/:poemid' component={PoemPage}/>
            <PrivateRoute exact path='/my_poems' component={MyPoemsPage}/>

            <Route component={PageNotFound}/>
        </Switch>)}/>
    </main>
}

export default MainContent;
