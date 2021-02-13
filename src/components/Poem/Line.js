import React from "react";
import {timestampToShortString} from "../../helpers/utils";

function Line({line, authored}) {
    let createdOn = timestampToShortString(line.dateCreated, true);
    return <li className={"line " +
    (authored ? "personal" : "")}>
        <span className="line-content">{line.content}</span>
        <span
            className='info'>added by
            {authored ? ' you' : " " + line.creator} {createdOn}
        </span>
    </li>;
}

export default Line;
