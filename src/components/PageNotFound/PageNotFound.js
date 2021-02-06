import React from "react";
import "page-not-found.css"
function PageNotFound() {
    return <div className="page-not-found">{new Array(40).map(() => [
        <span className="particle">4</span>,
        <span className="particle">0</span>
    ])}</div>
}

export default PageNotFound;
