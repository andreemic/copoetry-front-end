import React, {useEffect, useState} from "react";
import {useAuth0} from "../../react-auth0-spa";
import {REQ_STATUS} from "../../utils";
import Skeleton from "react-loading-skeleton";
import PoemPreview from "../ReadPage/PoemPreview";
const NUMBER_SKELETONS = 5;
function MyPoemsPage() {
    const {
        getTokenSilently,
        user
    } = useAuth0();
    const [poems, setPoems] = useState()
    const [error, setError] = useState("");
    const [loadPoemsStatus, setLoadPoemsStatus] = useState(REQ_STATUS.NOT_STARTED);
    const [poemSkeletons, setPoemSkeletons] = useState([])
    useEffect(() => {
        const getPoems = async () => {
            if (!user.nickname) {
                setError('Try logging in via Google.')
                return
            }
            try {
                setLoadPoemsStatus(REQ_STATUS.LOADING)
                const token = await getTokenSilently();
                // Send a GET request to the server and add the signed in user's
                // access token in the Authorization header
                const response = await fetch("/api/get/my_poems/" + user.nickname, {
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
                    setError("No poems here... Go write some!")
                    console.error(responseData)
                }
            } catch (error) {
                setLoadPoemsStatus(REQ_STATUS.FAIL)
                setError("No poems here... Go write some!");
                console.error(error)
            }
        };

        function getPoemSkeletons(n) {
            return Array.from({length: n}, (x, idx) => <Skeleton key={"poem-skeleton-"+idx} height={n}/>)
        }

        getPoems();
        setPoemSkeletons(getPoemSkeletons(NUMBER_SKELETONS));
    }, [getTokenSilently, setError, setPoems, setPoemSkeletons, user]);

    return <div className="read-page">
        {
            loadPoemsStatus <= REQ_STATUS.LOADING ? poemSkeletons :
                (error == "" && poems
                        ? poems.map((poem, idx) => <PoemPreview poem={poem} linkPrefix={"read"} key={"poem-preview-" + idx}/>)
                        : <span className="error">{error}</span>
                )
        }
    </div>
}

export default MyPoemsPage;
