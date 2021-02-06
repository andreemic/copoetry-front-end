import React, {useEffect, useState} from "react"
import {useAuth0} from "../../helpers/react-auth0-spa"
import Skeleton from 'react-loading-skeleton'
import "./Poem.css"
import Line from "./Line"
import {REQ_STATUS, getRequestStatusClass} from "../../utils";
import {useApi} from "../../helpers/api";
import {getErrorMessage, LINE_SEND_ERR, showError, showInfo, showSuccess} from "../../helpers/ui-msg";
import canAddLineToPoem from "../../helpers/canAddLineToPoem";
import {useMediaQuery} from 'react-responsive'

const MIN_SKEL_LENGTH = 200
const MAX_SKEL_LENGTH = 400
const SKEL_LINE_NUM = 7

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

/*
 * initPoem - Poem Object (see PoemPage for format).
 * showSkeleton - whether to display loading skeleton UI.
 */
function Poem({poem, setPoem, showSkeleton}) {
    const {user} = useAuth0();
    const [linesSkeleton, setLinesSkeleton] = useState([]);
    const [newLineInput, setNewLineInput] = useState("");
    const isMobile = useMediaQuery({query: '(max-width: 480px)'})


    const api = useApi();
    const [submitLineStatus, setSubmitLineStatus] = useState(REQ_STATUS.NOT_STARTED);
    useEffect(() => {
        // Create lines placeholder once
        let linesSkeletonArr = [];
        for (let i = 0; i < SKEL_LINE_NUM; i++)
            linesSkeletonArr.push(<Skeleton key={'lines-pholder-' + i}
                                            width={randInt(MIN_SKEL_LENGTH, MAX_SKEL_LENGTH)}/>)
        setLinesSkeleton(linesSkeletonArr)
    }, []);

    const submitLine = () => {
        let poemId = poem.id;
        let content = newLineInput;
        if (!content || !content.length || content.length === 0) return;

        setSubmitLineStatus(REQ_STATUS.LOADING)
        api.submitLine(poemId, content).then(response => {
            if (response.status === "success") {
                // Line successfully submitted, Poem is inside response.
                setSubmitLineStatus(REQ_STATUS.SUCCESS);
                setPoem(response.data)
            } else {
                setSubmitLineStatus(REQ_STATUS.FAIL);
                showError(getErrorMessage(LINE_SEND_ERR));
                console.error(response.message);
            }
        });
    };

    const inputValid = () => newLineInput.length > 0;
    const handleNewLineInput = (event) => setNewLineInput(event.target.value)
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValid()) {
            submitLine()
        }
    }

    if (submitLineStatus === REQ_STATUS.SUCCESS && newLineInput !== "") {
        setNewLineInput("");
    }

    if (!poem)
        return <div className="poem"/>
    let contributors = poem.lines.filter(line => line.creator !== poem.creator)
        .map(line => line.creator === user.nickname ? 'you' : line.creator)
    if (contributors.length > 4) contributors = contributors.slice(0, 4).concat("...")

    return <div className={"poem " + (canAddLineToPoem(poem, user) ? "poem-editable" : "")}>
        <div className="poem-title-con">
            <h3 className="poem-title">{poem.title}</h3>
            <span className="small-boxy poem-title-creator">
                by {poem.creator === user.nickname ? <span className='personal'>you</span> : poem.creator}
                {contributors.length === 0 ? null : " feat. " + contributors.join(', ')}
            </span>
        </div>
        {showSkeleton ? linesSkeleton :
            poem.lines && poem.lines.map((line, index) =>
                <Line key={"line-" + poem.id + index} line={line} authored={line.creator === user.nickname}/>
            )
        }
        {(!showSkeleton && canAddLineToPoem(poem, user)) && <div>
            <input required={true} maxLength={42}
                   className={"line poem-input-field " + getRequestStatusClass(submitLineStatus)}
                   value={newLineInput} onChange={handleNewLineInput}
                   type="text" onKeyDown={handleKeyDown} autoFocus={true} placeholder="Go off..."/>
            , <span className={"add-poem-btn " + (inputValid() ? "" : "hidden")}
                    onClick={submitLine}>Add Line
                                <span className="pen-emoji"/>️
                        </span>
        </div>
        }
    </div>
}

export default Poem
