import React from "react";
import {timestampToShortString} from "../../utils";

function Line({line, authored}) {
    let createdOn = timestampToShortString(line.dateCreated);
    return <li className={"line " +
    (authored ? "personal" : "")}>
        <span className="line-content">{line.content}</span>
        <span
            className='info'>added by
            {authored ? ' you' : " " + line.creator} {createdOn === "today" ? createdOn : " on " + createdOn}
        </span>
    </li>;
}

export default Line;
