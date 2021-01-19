import React, {useState, useEffect, useProps} from "react"

import {useAuth0} from "../../react-auth0-spa";
import {useParams, Redirect} from "react-router-dom"
import Poem from "../Poem/Poem"
import PoemInput from "../WritePage/PoemInput";
import {REQ_STATUS} from "../../utils";

/*
 * Poem request body will be something like :
 * {
    "id":"20f8707d6000108",
    "title":"MyPoem",
    "dateCreated":"2021-01-15T00:00:00+01:00",
    "lines":[
      {
         "line_id":"8010006d7078f02",
         "date_created":"2021-01-14T00:00:00+01:00",
         "creator":"mikhail",
         "content":"Two roads diverged in yellow wood",
         "poem_id":"20f8707d6000108"
      }
    ]
    }
 */
const ALL_POEMS_GONE_MSG = "All poems are gone. High time to start a new one!"
const NO_POEM_HERE_MSG = "No poem over here..."
function PoemPage({random, editable, addingPoem, setParentError, refresh}) {
    const {
        getTokenSilently,
        user,
        isAuthenticated,
    } = useAuth0();

    const {poemid} = useParams();
    const [poem, setPoem] = useState()
    const [loadPoemStatus, setLoadPoemStatus] = useState(REQ_STATUS.NOT_STARTED);
    // status of uploading a new line. See utils.js for possible values.
    const [sendLineStatus, setSendLineStatus] = useState(REQ_STATUS.NOT_STARTED);
    const noPoemsMsg = random ? ALL_POEMS_GONE_MSG : NO_POEM_HERE_MSG;

    useEffect(() => {
        const getPoem = async () => {
            if (!random && !poemid) {
                setParentError(noPoemsMsg)
                return
            }

            try {
                setLoadPoemStatus(REQ_STATUS.LOADING)
                const token = await getTokenSilently();
                // Send a GET request to the server and add the signed in user's
                // access token in the Authorization header
                const response = await fetch("/copoetry/api/get/poem/" + (random ? "random/" + user.nickname : poemid), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const responseData = await response.json();
                if (response.ok) {
                    setLoadPoemStatus(REQ_STATUS.SUCCESS)
                    // To-Do: Check more thoroughly whether response is valid and log better errors.
                    setPoem(responseData);
                } else {
                    setLoadPoemStatus(REQ_STATUS.FAIL)
                    setParentError(noPoemsMsg)
                    console.error(responseData)
                }
            } catch (error) {
                setLoadPoemStatus(REQ_STATUS.FAIL)
                setParentError(noPoemsMsg);
                console.error(error)
            }
        };
        setLoadPoemStatus(REQ_STATUS.NOT_STARTED)
        setSendLineStatus(REQ_STATUS.NOT_STARTED)
        getPoem();
    }, [refresh]);

    const submitLine = async (poemId, content) => {
        if (!poemId) {
            setParentError("Can't submit poem... Try reloading.")
            return
        } else if (poemId.length == 0 || !content || !content.length || content.length == 0)
            setParentError("Someone screwed up data pipeline between components... Try reloading.")

        try {
            setSendLineStatus(REQ_STATUS.LOADING)
            const token = await getTokenSilently();
            const response = await fetch("/copoetry/api/add/line", {
                method: "post",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({poemId, content, creator: user.nickname || user.givenName})
            });

            const responseData = await response.json();
            if (response.ok) {
                setSendLineStatus(REQ_STATUS.SUCCESS)
            } else {
                setSendLineStatus(REQ_STATUS.FAIL)
                setParentError("Couldn't upload the line... See console for error.")
                console.error(responseData)
            }
        } catch (error) {
            setParentError("Couldn't get this poem... See console for error.");
            console.error(error)
        }
    };


    const [sendPoemStatus, setSendPoemStatus] = useState(REQ_STATUS.NOT_STARTED)
    const submitPoem = async (title) => {
        if (!title || !title.length || title.length < 1)
            setParentError("Come on, you can do better.")

        try {
            setSendPoemStatus(REQ_STATUS.LOADING)
            const token = await getTokenSilently();
            const response = await fetch("/copoetry/api/add/poem", {
                method: "post",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title, creator: user.nickname || user.givenName})
            });

            const responseData = await response.json();
            if (response.ok) {
                setSendPoemStatus(REQ_STATUS.SUCCESS)

            } else {
                setSendPoemStatus(REQ_STATUS.FAIL)
                setParentError("Couldn't upload the line... See console for error.")
                console.error(responseData)
            }
        } catch (error) {
            setParentError("Couldn't get this poem... See console for error.");
            console.error(error)
        }
    };

    if (!isAuthenticated)
        return <Redirect to='/welcome'/>

    return <div className="poem-page">
        {addingPoem ? <PoemInput onSubmit={submitPoem} submitStatus={sendPoemStatus}/>
            : <Poem loading={loadPoemStatus} poem={poem} editable={editable} onSubmit={editable ? submitLine : null}
                    loadPoemStatus={loadPoemStatus} sendLineStatus={sendLineStatus}/>}
    </div>;
}

export default PoemPage
