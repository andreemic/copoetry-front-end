import React, {useState} from "react"
import PoemPage from "./PoemPage";

function ReadPoemPage() {
    const [error, setError] = useState("")
    return !error ? <PoemPage editable={false} random={false} setParentError={setError}/> :
        <span className="error">{error}</span>;
}

export default ReadPoemPage;
