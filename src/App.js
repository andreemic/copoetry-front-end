import './App.css';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import {useAuth0} from "./helpers/react-auth0-spa";
import {ThreeDots} from '@agney/react-loading';
import {Slide, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from "./components/PrivateRoute";
import Header from './components/Header/Header'
import WritePage from './components/WritePage/WritePage'
import ReadAllPoemsPage from './components/PoemsOverview/ReadAllPoemsPage'
import MyPoemsPage from "./components/PoemsOverview/MyPoemsPage";
import PoemPage from "./components/PoemPage/PoemPage";
import WelcomePage from "./components/WelcomePage/WelcomePage"
import Background from "./components/Background/Background";
import {useApi} from "./helpers/api";

function App() {
    const {isAuthenticated} = useAuth0();
    const {loading} = useAuth0();
    const {anonymous, toggleAnonymous} = useApi();

    return <div className={"app-con " + (anonymous ? "darkmode" : "")}>
        <Background/>
        {loading ? <ThreeDots className="big-loader" width="100"/> :
            <div className="app-wrapper">
                <BrowserRouter>
                    {isAuthenticated && <Header anonymous={anonymous} toggleAnonymous={toggleAnonymous}/>} {/*To-do: better logic for hiding header on Welcome*/}
                    <Switch>
                        <Route path='/welcome' component={WelcomePage}/>
                        <PrivateRoute path='/write' component={WritePage}/>

                        {/*<PrivateRoute path='/read/:poemid' component={PoemPage}/>
                        <PrivateRoute path='/read' component={ReadAllPoemsPage}/>*/}

                        <PrivateRoute path='/my_poems/:poemid' component={PoemPage}/>
                        <PrivateRoute path='/my_poems' component={MyPoemsPage}/>
                        <Route component={isAuthenticated ? WritePage : WelcomePage}/>
                    </Switch>
                </BrowserRouter>
            </div>
        }
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
    </div>;
}

export default App;
