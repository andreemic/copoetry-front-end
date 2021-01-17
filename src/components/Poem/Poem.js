import React, {useEffect, useState} from "react"
import {useAuth0} from "../../react-auth0-spa"
import Skeleton from 'react-loading-skeleton'
import "./Poem.css"
import Line from "./Line"
import {REQ_STATUS, getRequestStatusClass} from "../../utils";

const MIN_SKEL_LENGTH = 200
const MAX_SKEL_LENGTH = 400
const SKEL_LINE_NUM = 7

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

/*
 * poem - Poem Object (see PoemPage for format).
 * editable - boolean whether edit UI should be rendered.
 * loading - boolean whether skeleton should be showed.
 * onSubmit - callback with paramters (poemId, content) called when user presses Enter.
 */
function Poem({poem, editable, loading, onSubmit, loadPoemStatus, sendLineStatus}) {
    const {user} = useAuth0();
    const [linesPlaceholder, setLinesPlaceholder] = useState([]);
    const [newLineContent, setNewLine] = useState("");
    const [showNewFakeLine, setShowNewFakeLine] = useState(false);

    useEffect(() => {
        // Create lines placeholder once
        let linesSkeleton = [];
        for (let i = 0; i < SKEL_LINE_NUM; i++)
            linesSkeleton.push(<Skeleton key={'lines-pholder-' + i} width={randInt(MIN_SKEL_LENGTH, MAX_SKEL_LENGTH)}/>)
        setLinesPlaceholder(linesSkeleton)
    }, []);

    function handleNewLineInput(event) {
        setNewLine(event.target.value)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSubmit(poem.id, event.target.value)
        }
    }

    function constructLine(content) {
        return {
            creator: user.nickname,
            content: content
        }
    }

    console.log(sendLineStatus)
    if (sendLineStatus == REQ_STATUS.SUCCESS) {
        setTimeout(() => setShowNewFakeLine(true), 700)
    } else if (showNewFakeLine) {
        // To-Do: Better way to reset state.
        setNewLine("")
        setShowNewFakeLine(false)
    }


    if (!poem)
        return <div className="poem"></div>

    return <div className={"poem " + (editable ? "poem-editable" : "")}>
        <div className="poem-title-con">
            <h3 className="poem-title">{poem.title}</h3>
            <span className="small-boxy poem-title-creator">
                started by {poem.creator == user.nickname ?
                <span className='personal'>you</span> : poem.creator}
            </span>
        </div>
        {loadPoemStatus === REQ_STATUS.LOADING ? linesPlaceholder :
            poem.lines && poem.lines.map((line, index) =>
                <Line key={index} line={line} authored={line.creator === user.nickname}/>
            )
        }
        {editable && (!showNewFakeLine ?
                <input required={true} maxLength={42}
                       className={"line line-input " + getRequestStatusClass(sendLineStatus)}
                       value={newLineContent} onChange={handleNewLineInput}
                       type="text" onKeyDown={handleKeyDown} autoFocus={true} placeholder="Go off..."/>
                : <Line line={constructLine(newLineContent)} authored={true}/>
        )}
    </div>
}

export default Poem
