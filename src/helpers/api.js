import {useAuth0} from "./react-auth0-spa";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {Context} from "./anonymous";

const defaultResponse = {
    status: "error",
    message: "Trouble communicating with our servers."
}

function useApi(anonymous) {
    // Function for getting the Access Token
    const {getTokenSilently, user} = useAuth0()
    const [registered, setRegistered] = useState();
    const [state, dispatch] = useContext(Context);

    // If any of these requests return null, communication with the server was unsuccessful.
    // (invalid auth token, blabla)
    // To-Do: Pass statuses down to the caller to reflect particular statuses in UI.
    const makeRequest = async (path, method = 'GET', body = undefined, addAnonymous = false) => {
        let token = await getTokenSilently();
        try {
            let params = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            if (method === 'POST') {
                if (addAnonymous) body = {...body, anonymous: state.anonymous};
                params['body'] = JSON.stringify(body);
            }
            const response = await fetch(path, params);
            let responseBody = await response.json();
            if (responseBody.status === undefined) return defaultResponse; // Auth errors result in a string.

            return responseBody;
        } catch (e) {
            return defaultResponse;
        }
    }


    const getPoemByID = useCallback(async (poemId) =>
            makeRequest("/api/get/poem/" + poemId)
        , [])

    const submitLine = async (poemId, content, beginCompletionVote) =>
        makeRequest('/api/add/line', 'POST', {poemId, content, beginCompletionVote}, true)


    const getRandomPoem = useCallback(async () =>
            makeRequest('/api/get/random-poem')
        , [])

    const submitPoem = async (title, firstLine) => {
        if (!title || !title.length || title.length === 0) throw new Error("Trying to send titleless Poem.");
        return makeRequest('/api/add/poem', 'POST', {title, firstLine}, true);
    };

    const getNeedsToVote = useCallback(async () =>
            makeRequest('/api/user/needs-to-vote')
        , [])

    const getUserPoems = useCallback(async (limit, offset) =>
            makeRequest(`/api/get/my-poems?limit=${limit}&offset=${offset}`)
        , [])

    const getPoems = useCallback(async (limit, offset) =>
            makeRequest(`/api/get/poems/all?limit=${limit}&offset=${offset}`)
        , [])

    const register = useCallback(async () =>
        user !== undefined && makeRequest("/api/user/register", 'POST', {nickname: user.nickname})
        , []);
    const castCompletionVote = useCallback(async (votingId, forCompletingPoem) =>
            makeRequest("/api/poem/completion-vote", 'POST', {forCompletingPoem, votingId})
        , [])
    const updateNeedsToVote = () => {
        getNeedsToVote().then(result => {
            let needsToVote = false
            if (result.status === "success") {
                needsToVote = result.data;
            }
            dispatch({type: "SET_NEEDS_TO_VOTE", payload: needsToVote});
        }).catch(console.error);
    }

    // Register with API asap.
    useEffect(() => {
        console.log(registered)
        if (registered) return;
        register().then(resp => {
            if (resp.status === "success") {
                setRegistered(true);
            }
        });
    }, [user]);

    return {
        getPoemByID,
        getPoems,
        getRandomPoem,
        getUserPoems,
        submitLine,
        submitPoem,
        updateNeedsToVote,
        castCompletionVote
    };
}

export {useApi};
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
