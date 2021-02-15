import React, {useEffect, useState} from "react";
import "./writePage.css"
import {REQ_STATUS} from "../../helpers/utils";
import {useApi} from "../../helpers/api";
import Poem from "../Poem/Poem";
import PoemInput from "./PoemInput";
import {getErrorMessage, POEM_SEND_ERR, showError, showInfo, showSuccess} from "../../helpers/ui-msg";
import {useMediaQuery} from "react-responsive";
import {Link} from "react-router-dom";

function WritePage() {
    const [error, setError] = useState("")

    const {getRandomPoem, submitPoem} = useApi();
    const [poem, setPoem] = useState()
    const [loadPoemStatus, setLoadPoemStatus] = useState(REQ_STATUS.NOT_STARTED);
    const [addingPoem, setAddingPoem] = useState(false);
    const [submitPoemStatus, setSubmitPoemStatus] = useState(REQ_STATUS.NOT_STARTED);
    const isMobile = useMediaQuery({query: '(max-width: 480px)'})

    const getNewPoem = () => {
        setLoadPoemStatus(REQ_STATUS.LOADING);
        getRandomPoem().then(response => {
            if (response.status === "success") {
                setLoadPoemStatus(REQ_STATUS.SUCCESS);
                setPoem(response.data);
            } else if (response.status === "error" && response.httpStatus === 404) {
                // No editable poems.
                setLoadPoemStatus(REQ_STATUS.FAIL);
                setPoem(null);
            } else {
                // Request gone wrong.
                setLoadPoemStatus(REQ_STATUS.FAIL);
                setError(response.message);
            }
        }).catch(err => {
            setError("Can't load this poem.")
        });
    }
    useEffect(getNewPoem, []);


    const onSubmitPoem = (title, firstLine) => {
        if (!title || !firstLine || firstLine.length === 0 || title.length === 0) return;
        setSubmitPoemStatus(REQ_STATUS.LOADING)
        submitPoem(title, firstLine).then(response => {
            if (response.status === "success") {
                // Updated Poem is inside response.data.
                setSubmitPoemStatus(REQ_STATUS.SUCCESS);
                setTimeout(() => setSubmitPoemStatus(REQ_STATUS.NOT_STARTED), 700)
                setPoem(response.data);
                setAddingPoem(false);
                showSuccess("Poem created.");
                getNewPoem()
            } else {
                setError(response.message);
                setSubmitPoemStatus(REQ_STATUS.FAIL);
                showError(getErrorMessage(POEM_SEND_ERR));
            }
        }).catch(() => setError("Couldn't submit this poem. Try reloading the page."));
    };

    return <div className={"write-page"}>
        <p className="page-desc">
            {error === "" ?
                (addingPoem ? <span>Do your thing.</span> :
                    (poem == null ? <span>No poems going around at the moment... Start your own!</span> :
                        (isMobile ? <span>Here's a poem someone started. Add a line and watch it grow under
                             <Link to="/my_poems"> my poems</Link> or start your own.</span> : <span>Here's a poem someone started.
            You get one shot to add a line. If you choose to skip, the poem flies away to someone else.
                But if you don't, you can watch it grow under <i>my poems</i>.</span>)))
                : <span>{error}</span>
            }
        </p>
        <div className={"write-page-btn-con" + (addingPoem ? ' hidden' : '')}>
            <button onClick={() => setAddingPoem(true)}>Add Poem</button>
            {poem == null ? null : <button onClick={getNewPoem}>Skip Poem</button>}
        </div>
        {addingPoem ? <PoemInput onSubmit={onSubmitPoem} submitStatus={submitPoemStatus}/>
            : (poem != null ?
                <Poem poem={poem} setPoem={setPoem} showSkeleton={loadPoemStatus === REQ_STATUS.LOADING}/> : null)}
    </div>;
}

export default WritePage;
