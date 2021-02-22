import React from "react";
import "./page-not-found.css"
function PageNotFound() {
    return <div className="page-not-found">{new Array(40).fill(1).map((val, idx) => [
            <span key={`particle-4-${idx}`} className="particle">4</span>,
            <span key={`particle-0-${idx}`} className="particle">0</span>
        ])}
         <p>Nothing here...</p>
    </div>
}

export default PageNotFound;
