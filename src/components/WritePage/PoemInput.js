import React, {useState} from "react"
import {getRequestStatusClass, REQ_STATUS} from "../../helpers/utils";

function PoemInput({onSubmit, submitStatus}) {
    const [titleInput, setTitleInput] = useState("")
    const [firstLineInput, setFirstLineInput] = useState("")
    const handleTitleInput = (event) => setTitleInput(event.target.value)
    const handleLineInput = (event) => setFirstLineInput(event.target.value)
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputsValid()) submit()
    }
    const inputsValid = () => firstLineInput.length > 0 && titleInput.length > 0;
    const submit = () => onSubmit(titleInput, firstLineInput)

    return <div className={"poem poem-input " + (submitStatus === REQ_STATUS.LOADING ? " loading" : "")}>
        <input required={true} maxLength={42}
               className={"poem-title-input poem-title poem-input-field " + getRequestStatusClass(submitStatus)}
               value={titleInput} onChange={handleTitleInput}
               placeholder="Your title. Keep it mysterious..."
               type="text" onKeyDown={handleKeyDown} autoFocus={true}/>

        <h3><input required={true} maxLength={100}
                   className={"line poem-input-field " + getRequestStatusClass(submitStatus)}
                   value={firstLineInput} onChange={handleLineInput}
                   placeholder="First line. Something nice. Something one can build upon..."
                   type="text" onKeyDown={handleKeyDown} autoFocus={true}/></h3>
        <span className={"add-poem-btn " + (inputsValid() ? "" : "hidden")} onClick={submit}>
            Start Poem <span className="pen-emoji"/>
        </span>
    </div>
}

export default PoemInput
