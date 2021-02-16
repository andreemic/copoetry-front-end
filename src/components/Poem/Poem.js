import React, {useEffect, useState} from "react"
import {useAuth0} from "../../helpers/react-auth0-spa"
import Skeleton from 'react-loading-skeleton'
import "./Poem.css"
import Line from "./Line"
import {
    REQ_STATUS,
    getRequestStatusClass,
    getActiveVotingFromPoem,
    timestampToShortString,
    getPoemDateCompleted
} from "../../helpers/utils";
import {useApi} from "../../helpers/api";
import {getErrorMessage, LINE_SEND_ERR, showError, showSuccess} from "../../helpers/ui-msg";
import canAddLineToPoem from "../../helpers/canAddLineToPoem";

const MIN_SKEL_LENGTH = 200
const MAX_SKEL_LENGTH = 400
const SKEL_LINE_NUM = 7

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

/*
 * initPoem - Poem Object (see PoemPage for format).
 * showSkeleton - whether to display loading skeleton UI.
 */
function Poem({poem, setPoem, showSkeleton}) {
    const {user} = useAuth0();
    const [linesSkeleton, setLinesSkeleton] = useState([]);
    const [newLineInput, setNewLineInput] = useState("");
    const [completePoemInput, setCompletePoemInput] = useState(false);


    let api = useApi();
    const [submitLineStatus, setSubmitLineStatus] = useState(REQ_STATUS.NOT_STARTED);
    const activeVoting = getActiveVotingFromPoem(poem)
    useEffect(() => {
        // Create lines placeholder once
        const ac = new AbortController();
        let linesSkeletonArr = [];
        for (let i = 0; i < SKEL_LINE_NUM; i++)
            linesSkeletonArr.push(<Skeleton key={'lines-pholder-' + i}
                                            width={randInt(MIN_SKEL_LENGTH, MAX_SKEL_LENGTH)}/>)
        setLinesSkeleton(linesSkeletonArr)
        return () => ac.abort();
    }, []);

    const submitLine = () => {
        let poemId = poem.id;
        let content = newLineInput;
        if (!content || !content.length || content.length === 0) return;

        setSubmitLineStatus(REQ_STATUS.LOADING)
        api.submitLine(poemId, content, completePoemInput).then(response => {
            if (response.status === "success") {
                // Line successfully submitted, Poem is inside response.
                setSubmitLineStatus(REQ_STATUS.SUCCESS);
                setTimeout(() => setSubmitLineStatus(REQ_STATUS.NOT_STARTED), 500)
                setPoem(response.data)
                setNewLineInput("");
            } else {
                setSubmitLineStatus(REQ_STATUS.FAIL);
                showError(getErrorMessage(LINE_SEND_ERR));
                console.error(response.message);
            }
        });
    };

    const inputValid = () => newLineInput.length > 0;
    const handleNewLineInput = (event) => {
        setNewLineInput(event.target.value)
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValid()) {
            submitLine()
        }
    }
    const handleCompletePoemInput = (event) => setCompletePoemInput(event.target.checked)


    const onVoteInput = (event) => {
        let forCompletingPoem = (event.target.id === "voteCompletePoemCheckbox");
        api.castCompletionVote(activeVoting.id, forCompletingPoem).then(response => {
            if (response.status === "success") {
                api.updateNeedsToVote();
                setPoem(response.data);
                try {
                    showSuccess(response.data.completed ? `You had the final word. "${response.data.title}" is complete.` :
                        (response.data.completionVotings.filter(v => v.id === activeVoting.id)[0].status === "stopped"
                            ? "Vote casted. The Poem goes on." : "Vote casted."))
                } catch(e) {
                    showSuccess("Vote casted.")
                }
            } else {
                event.target.checked = false;
                showError(response.message);
            }
        })
    };

    if (!poem)
        return <div className="poem"/>
    let contributors = poem.lines.filter(line => line.creator !== poem.creator)
        .map(line => line.creator === user.nickname ? 'you' : line.creator).filter(onlyUnique);
    if (contributors.length > 4) contributors = contributors.slice(0, 2).concat("...")

    return <div className={"poem " + (canAddLineToPoem(poem, user) ? "poem-editable " : "")}>
        <div className="poem-title-con">
            <h3 className="poem-title">{poem.title}</h3>
            <span className="small-boxy poem-title-creator">
                by {poem.creator === user.nickname ? <span className='personal'>you</span> : poem.creator}
                {contributors.length === 0 ? null : " feat. " + contributors.join(', ')}
            </span>
        </div>
        <div className={"poem-main"}>
        {showSkeleton ? linesSkeleton :
            poem.lines && poem.lines.map((line, index) =>
                <Line key={"line-" + poem.id + index} line={line} authored={line.creator === user.nickname}/>
            )
        }
        {(!showSkeleton && activeVoting === null && canAddLineToPoem(poem, user)) && <div>
            <input required={true} maxLength={42}
                   className={"line poem-input-field " + getRequestStatusClass(submitLineStatus)}
                   value={newLineInput} onChange={handleNewLineInput}
                   type="text" onKeyDown={handleKeyDown} autoFocus={true} placeholder="Go off..."/>
            <div className={"add-line-input-con " + (inputValid() ? "" : "hidden")}>
                <span className={"add-line-input-complete-con"}>
                    <input type="checkbox" id="completePoemCheckbox" checked={completePoemInput}
                           onChange={handleCompletePoemInput}/>
                    <label htmlFor={"completePoemCheckbox"}>My line should end the poem. <span
                        className={"small-label-subtext"}>starts vote among your co-authors</span></label>
                </span>
                <span className={"add-poem-btn"} onClick={submitLine}>Add Line
                                <span className="pen-emoji"/>️
                </span>
            </div>
        </div>}
        {activeVoting !== null && <div className={"poem-active-voting"}>
            <span className={"poem-active-voting-title"}>
                {activeVoting.creator === user.nickname ? "You thought" : activeVoting.creator + " thinks"} it's time to wrap this poem up.
            </span>
            {activeVoting.userVoted ?
                <div className={"poem-active-voting-info"}>
                    {activeVoting.votesFor + activeVoting.votesAgainst > 3 ? (activeVoting.votesFor > activeVoting.votesAgainst ?
                        "Most of your co-authors agree." :
                        (activeVoting.votesFor === activeVoting.votesAgainst ?
                            "Oh, this is a controversial one! It's a tie." : "Most of your co-authors do not agree"))
                        : (activeVoting.creator === user.nickname ? "Let's see what the others say..." : "")}
                </div>
                : <div className={"poem-active-voting-choice-con"}>
                    What do you think?
                    <div className={"poem-active-voting-input-con"}>
                        <span className={"poem-active-voting-input"}>
                            <input type="checkbox" id="voteCompletePoemCheckbox" onChange={onVoteInput}/>
                            <label htmlFor={"voteCompletePoemCheckbox"}>Agreed.</label>
                        </span>
                        <span className={"poem-active-voting-input"}>
                            <input type="checkbox" id="voteContinuePoemCheckbox" onChange={onVoteInput}/>
                            <label htmlFor={"voteContinuePoemCheckbox"}>Not so fast...</label>
                        </span>
                    </div>
                </div>}
        </div>}
        </div>

        <div className={"poem-footer small-boxy"}>
                    <span className="poem-date">
                        Started {timestampToShortString(poem.dateCreated)}
                        {poem.completed && `, completed ${timestampToShortString(getPoemDateCompleted(poem))}`}
                    </span>
        </div>
    </div>
}

export default Poem
