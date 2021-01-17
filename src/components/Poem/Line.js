import React from "react";

function Line({line, authored}) {
    return <li className={"line " +
    (authored ? "personal" : "")}>
        <span className="line-content">{line.content}</span>
        <span className='info'>added by {authored ? 'you' : line.creator}</span>
    </li>;
}

export default Line;
