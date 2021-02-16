import React, {useEffect, useState} from "react"
import {REQ_STATUS} from "../../helpers/utils";
import {useParams} from "react-router-dom";
import {useApi} from "../../helpers/api";
import Poem from "../Poem/Poem";

function PoemPage() {
    const [error, setError] = useState("")
    const [poem, setPoem] = useState()
    const {getPoemByID} = useApi();
    const [loadPoemStatus, setLoadPoemStatus] = useState(REQ_STATUS.NOT_STARTED);
    const {poemid} = useParams();
    const getPoem = () => {
        setLoadPoemStatus(REQ_STATUS.LOADING);
        getPoemByID(poemid).then(response => {
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
    return !error ? <Poem poem={poem} setPoem={setPoem} showSkeleton={loadPoemStatus === REQ_STATUS.LOADING}/> :
        <span className="error">{error}</span>;
}

export default PoemPage;
