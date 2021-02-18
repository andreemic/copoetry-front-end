import {getPoemDateCompleted, timestampToShortString} from "../../helpers/utils";
import React from "react";

function PoemFooter({poem}) {
    return <div className={"poem-footer small-boxy"}>
                    <span className="poem-date">
                        Started {timestampToShortString(poem.dateCreated)}
                        {poem.completed && `, completed ${timestampToShortString(getPoemDateCompleted(poem))}`}
                    </span>
    </div>
}

export default PoemFooter;
