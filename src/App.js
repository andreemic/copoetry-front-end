import './App.css';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import {useAuth0} from "./react-auth0-spa";
import {useLoading, ThreeDots} from '@agney/react-loading';
import {css, styled} from 'css-zero/macro';

import PrivateRoute from "./components/PrivateRoute";
import Header from './components/Header/Header'
import WritePage from './components/WritePage/WritePage'
import ReadPage from './components/ReadPage/ReadPage'
import MyPoemsPage from "./components/MyPoemsPage/MyPoemsPage";
import ReadPoemPage from "./components/PoemPage/ReadPoemPage";
import WelcomePage from "./components/WelcomePage/WelcomePage"
import Background from "./components/Background/Background";

function App() {
    const {isAuthenticated} = useAuth0();
    const { loading } = useAuth0();

    return <div>
        <Background/>
        {loading ? <ThreeDots className="big-loader" width="100"/> :
            <div className="app-wrapper">
                <BrowserRouter basename={'/copoetry'}>
                    {isAuthenticated && <Header/>} {/*To-do: better logic for hiding header on Welcome*/}
                    <Switch>
                        <Route path='/welcome' component={WelcomePage}/>
                        <PrivateRoute path='/write' component={WritePage}/>

                        <PrivateRoute path='/read/:poemid' component={ReadPoemPage}/>
                        <PrivateRoute path='/read' component={ReadPage}/>

                        <PrivateRoute path='/my_poems/:poemid' component={ReadPoemPage}/>
                        <PrivateRoute path='/my_poems' component={MyPoemsPage}/>
                        <Redirect to={isAuthenticated ? 'write' : '/welcome'}/>
                    </Switch>
                </BrowserRouter>
            </div>
        }
    </div>;
}

export default App;
