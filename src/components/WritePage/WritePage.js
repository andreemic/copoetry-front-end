import React, {useState} from "react";
import PoemPage from "../PoemPage/PoemPage";
import "./writePage.css"
import {REQ_STATUS} from "../../utils";
import {useAuth0} from "../../react-auth0-spa";

function WritePage() {
    const [error, setError] = useState("");
    const [addingPoem, setAddingPoem] = useState(false);
    const [refresh, setRefresh] = useState(false);

    return <div>
        <p className="page-desc">
            {error === "" ?
                (addingPoem ? <span>Choose a title and press enter to send.</span> : <span>Here's a poem someone started.
            You get one shot to add a line. If you choose to skip, the poem flies away to someone else.
                But if you don't, you can watch it grow under <i>my poems</i>.</span>)
                : <span>{error}</span>
            }
        </p>
        <div className={"write-page-btn-con" + (addingPoem ? ' hidden' : '') }>
            <button onClick={() => setAddingPoem(true)}>Add Poem</button>
            <button onClick={() => setRefresh(!refresh)}>Skip Poem</button>
        </div>
        <PoemPage random={true} editable={true} setParentError={setError} addingPoem={addingPoem} refresh={refresh}/>
    </div>;
}

export default WritePage;
