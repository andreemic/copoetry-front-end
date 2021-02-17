import React, {lazy, Suspense, useEffect, useState} from "react"
import {REQ_STATUS} from "../../helpers/utils";
import {useParams} from "react-router-dom";
import {useApi} from "../../helpers/api";
import Poem from "../Poem/Poem";
const PageNotFound = lazy(() => import("../PageNotFound/PageNotFound"));

function PoemPage() {
    const [error, setError] = useState("")
    const [loadPoemCode, setLoadPoemCode] = useState(0);
    const [poem, setPoem] = useState()
    const {getPoemByID} = useApi();
    const [loadPoemStatus, setLoadPoemStatus] = useState(REQ_STATUS.NOT_STARTED);
    const {poemid} = useParams();
    const getPoem = () => {
        setLoadPoemStatus(REQ_STATUS.LOADING);
        getPoemByID(poemid).then(response => {
            setLoadPoemCode(response.httpStatus)
            if (response.status === "success") {
                setLoadPoemStatus(REQ_STATUS.SUCCESS);
                setPoem(response.data);
            } else {
                setLoadPoemStatus(REQ_STATUS.FAIL);
                setPoem(null);
                setError(response.message);
            }
        }).catch(err => {
            setError("Can't load this poem.")
        });
    }
    useEffect(getPoem, [getPoemByID, poemid]);
    if (loadPoemCode === 404) {
        return <Suspense fallback={<span/>}><PageNotFound/></Suspense>
    }
    return !error ? <Poem poem={poem} setPoem={setPoem} showSkeleton={loadPoemStatus === REQ_STATUS.LOADING}/> :
        <p className="poem-error">{error}</p>;
}

export default PoemPage;
