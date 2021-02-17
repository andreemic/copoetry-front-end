import React from "react";
import somethingWentWrongGIF from "./something-went-wrong.gif";
import './something-went-wrong.css';
function SomethingWentWrong() {
    return <div className={"something-went-wrong-con"}>
        <img className={"something-went-wrong-gif"} src={somethingWentWrongGIF} alt="Something went wrong..."/>
        <p>The issue has been reported. Please check in later.</p>
        <div className={"small-boxy small-boxy-btn"} onClick={() => window.location.reload()}>Refresh</div>
    </div>;
}

export default SomethingWentWrong;
