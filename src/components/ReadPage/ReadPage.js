import React, {useEffect, useState} from "react";
import {REQ_STATUS} from "../../helpers/utils";
import Poem from "../Poem/Poem";
import Skeleton from "react-loading-skeleton";
import {useAuth0} from "../../react-auth0-spa";
import PoemPreview from "./PoemPreview";

function ReadPage() {
    const {
        getTokenSilently
    } = useAuth0();
    const [poems, setPoems] = useState()
    const [error, setError] = useState("");
    const [loadPoemsStatus, setLoadPoemsStatus] = useState(REQ_STATUS.NOT_STARTED);
    const [poemSkeletons, setPoemSkeletons] = useState([])
    useEffect(() => {
        const getPoems = async () => {
            try {
                setLoadPoemsStatus(REQ_STATUS.LOADING)
                const token = await getTokenSilently();
                // Send a GET request to the server and add the signed in user's
                // access token in the Authorization header
                const response = await fetch("/copoetry/api/get/poems/all?offset=0&length=20", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const responseData = await response.json();
                if (response.ok) {
                    setLoadPoemsStatus(REQ_STATUS.SUCCESS)
                    // To-Do: Check more thoroughly whether response is valid and log better errors.
                    setPoems(responseData);
                } else {
                    setLoadPoemsStatus(REQ_STATUS.FAIL)
                    setError("No poems yet... Go write some!")
                    console.error(responseData)
                }
            } catch (error) {
                setLoadPoemsStatus(REQ_STATUS.FAIL)
                setError("No poems yet... Go write some!");
                console.error(error)
            }
        };

        function getPoemSkeletons(n) {
            return Array.from({length: n}, (x, idx) => <Skeleton key={"poem-skeleton-"+idx} height={n}/>)
        }

        getPoems();
        setPoemSkeletons(getPoemSkeletons(10));
    }, [getTokenSilently, setError, setPoems, setPoemSkeletons]);

    return <div className="read-page">
        {
            loadPoemsStatus <= REQ_STATUS.LOADING ? poemSkeletons :
            (error == "" && poems
                ? poems.map((poem, idx) => <PoemPreview poem={poem} linkPrefix={"read"} key={idx}/>)
                : <span className="error">{error}</span>
            )
        }
    </div>
}

export default ReadPage;
