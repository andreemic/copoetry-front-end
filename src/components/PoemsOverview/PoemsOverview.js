import React, {useEffect, useState} from "react";
import {REQ_STATUS} from "../../helpers/utils";
import PoemPreview from "./PoemPreview";
import Skeleton from "react-loading-skeleton";


const getPoemSkeletons = (n) =>
    Array.from({length: n}, (x, idx) => <Skeleton key={"poem-skeleton-" + idx} height={n}/>)

const POEMS_PER_PAGE = 3;
// getPoemsFunction is one of the functions from "/helpers/api.js".
//      This pattern is used to generalize "my_poems" and "read" page to this one.
function PoemsOverview({getPoemsFunction, poemsPerPage = 7}) {
    const [poems, setPoems] = useState(null)
    const [error, setError] = useState("");
    const [fatalError, setFatalError] = useState("");
    const [loadPoemsStatus, setLoadPoemsStatus] = useState(REQ_STATUS.NOT_STARTED);
    const [poemSkeletons, setPoemSkeletons] = useState([])

    // implement infinite scrolling with intersection observer
    // let bottomBoundaryRef = useRef(null);
    // const scrollObserver = useCallback(
        //node => {
            // new IntersectionObserver(entries => {
            //     entries.forEach(en => {
            //         if (en.intersectionRatio > 0) {
            //             // Get more poems.
            //             setLoadPoemsStatus(REQ_STATUS.LOADING);
            //             getPoemsFunction(POEMS_PER_PAGE, poems.length).then(newPoems => {
            //                 setPoems(poems.concat(newPoems))
            //                 setLoadPoemsStatus(REQ_STATUS.SUCCESS)
            //             }).catch(err => setLoadPoemsStatus(REQ_STATUS.FAIL))
            //         }
            //     });
            // }).observe(node);
        // },
        // [setPoems]
    // );/
    // useEffect(() => {
    //     if (bottomBoundaryRef.current) {
    //         scrollObserver(bottomBoundaryRef.current);
    //     }
    // }, [scrollObserver, bottomBoundaryRef]);



    useEffect(() => {
        const getPoemsInit = () => {
            setLoadPoemsStatus(REQ_STATUS.LOADING)
            getPoemsFunction(POEMS_PER_PAGE, 0).then(response => {
                setFatalError("");
                if (response.status === "success") {
                    setLoadPoemsStatus(REQ_STATUS.SUCCESS);
                    setPoems(response.data);
                } else if (response.httpStatus !== 500){
                    setLoadPoemsStatus(REQ_STATUS.FAIL);
                    setError(response.message)
                } else {
                    setFatalError(response.message);
                }
            }).catch(e => {
                console.error(e);
                setError("Can't get poems right now.")
            });
        };
        getPoemsInit()
        setPoemSkeletons(getPoemSkeletons(POEMS_PER_PAGE));
    }, [getPoemsFunction]);

    if (fatalError !== "") {
        throw new Error("Can't get poems: " + fatalError);
    }

    return <div className="poems-overview">
        {(loadPoemsStatus <= REQ_STATUS.LOADING) ? poemSkeletons :
            error === "" && poems != null
            ? (poems.length > 0 ? poems.map((poem, idx) => <PoemPreview poem={poem} linkPrefix={"my_poems"}
            key={"poem-preview-" + idx}/>)
            : <span>No poems here... You should go write some!</span>)
            : <span className="error">{error}</span>}

        {/*<div id='page-bottom-boundary' ref={bottomBoundaryRef}/>*/}
    </div>
}

export default PoemsOverview;
