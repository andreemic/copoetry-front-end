import React, {useState} from "react"
import {getRequestStatusClass, REQ_STATUS} from "../../utils";

function PoemInput({onSubmit, submitStatus}) {
    const [titleInput, setTitleInput] = useState("")
    const handleTitleInput = (event) => setTitleInput(event.target.value)
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') onSubmit(titleInput)
    }
    if (submitStatus === REQ_STATUS.NOT_STARTED)
        return <input required={true} maxLength={42} className={"title title-input " + getRequestStatusClass(submitStatus)}
               value={titleInput} onChange={handleTitleInput} placeholder="Your title. Keep it mysterious..."
               type="text" onKeyDown={handleKeyDown} autoFocus={true}/>
    else if (submitStatus === REQ_STATUS.SUCCESS)
        return <span className="poem-submit-success">
            Your poem is off to the races!
        </span>
    else if (submitStatus === REQ_STATUS.FAIL)
            return <span className="poem-submit-success">Your poem got lost in delivery... Try reloading</span>
    else return <span>Loading...</span>
}

export default PoemInput
