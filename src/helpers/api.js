import {useAuth0} from "./react-auth0-spa";
import {useCallback, useState} from "react";

const defaultResponse = {
    status: "error",
    message: "Trouble communicating with our servers."
}

function useApi() {
    // Function for getting the Access Token
    const {getTokenSilently} = useAuth0()
    const [anonymous, setAnonymous] = useState(false)
    const toggleAnonymous = () => setAnonymous(!anonymous)

    // If any of these requests return null, communication with the server was unsuccessful.
    // (invalid auth token, blabla)
    // To-Do: Pass statuses down to the caller to reflect particular statuses in UI.
    const makeRequest = async (path, method = 'GET', body = undefined) => {
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
                params['body'] = JSON.stringify({...body, anonymous});
            }
            const response = await fetch(path, params);
            let responseBody = await response.json();
            if (responseBody.status === undefined) return defaultResponse; // Auth errors result in a string.

            responseBody.httpStatus = response.status;
            return responseBody;
        } catch (e) {
            return defaultResponse;
        }
    }

    const getPoemByID = useCallback(async (poemId) =>
            makeRequest("/api/get/poem/" + poemId)
        , [])

    const submitLine = useCallback(async (poemId, content) =>
            makeRequest('/api/add/line', 'POST', {poemId, content})
        , [])

    const getRandomPoem = useCallback(async () =>
            makeRequest('/api/get/poem/random')
        , [])

    const submitPoem = useCallback(async (title, firstLine) => {
        if (!title || !title.length || title.length === 0) throw new Error("Trying to send titleless Poem.");
        return makeRequest('/api/add/poem', 'POST', {title, firstLine});
    }, [])


    const getUserPoems = useCallback(async (limit, offset) =>
            makeRequest(`/api/get/my_poems?limit=${limit}&offset=${offset}`)
        , [])

    const getPoems = useCallback(async (limit, offset) =>
            makeRequest(`/api/get/poems/all?limit=${limit}&offset=${offset}`)
        , [])

    return {toggleAnonymous, anonymous, getPoemByID, getPoems, getRandomPoem, getUserPoems, submitLine, submitPoem};
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
