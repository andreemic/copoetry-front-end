import React, {useState} from "react"
import "./read-page.css"
import {REQ_STATUS, timestampToShortString, getActiveVotingFromPoem} from "../../helpers/utils";

import Tilt from 'react-parallax-tilt';
import {useAuth0} from "../../helpers/react-auth0-spa";
import {Link} from "react-router-dom";
import {useMediaQuery} from "react-responsive/src";

const PREVIEW_LINES_NUM = 12;
const MAX_TILT_ANGLE = 8;

function PoemPreview({poem, linkPrefix}) {
    const {user} = useAuth0();
    if (!linkPrefix) linkPrefix = '';
    const userCanHover = !useMediaQuery({
        query: '(hover: none)'
    })
    const activeVoting = getActiveVotingFromPoem(poem)
    const userNeedsToVote = activeVoting !== null && !activeVoting.userVoted;
    return <Link to={linkPrefix + '/' + poem.id}>
        <Tilt tiltEnable={userCanHover && !poem.completed} tiltReverse={true} tiltMaxAngleX={MAX_TILT_ANGLE} tiltMaxAngleY={MAX_TILT_ANGLE}
              className={"poem-preview " + (poem.completed ? "completed " : "") + (userNeedsToVote ? "voting-active" : "")}>
            <h3>{poem.title}</h3>
            <div className="poem-preview-content">
                <p>
                    {poem.lines && poem.lines.slice(0, PREVIEW_LINES_NUM).map((line, idx) =>
                        <li className={"poem-preview-line" + (line.creator === user.nickname ? ' personal' : '')} key={"my-preview-" + idx}
                            style={{
                                opacity: 1 - (idx + 1) / PREVIEW_LINES_NUM
                            }}>
                            {line.content}
                        </li>)}
                </p>
            </div>
            {userNeedsToVote ?  <div className={"poem-preview-votemsg"}>
                    <div>One of your co-authors thinks this poem is done. Do you agree?</div>
                    <div className={"small-boxy small-boxy-btn"}>Go Vote</div>
            </div>
                : <div className="poem-preview-footer small-boxy">
                <span className="poem-preview-date">{timestampToShortString(poem.dateCreated, true)}</span>
                <span className="poem-preview-creator">started by {poem.creator === user.nickname ?
                    <span className='personal'>you</span> : poem.creator}</span>
            </div>}
        </Tilt>
    </Link>
}

export default PoemPreview
