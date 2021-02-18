import React, {useState} from "react";
import {getRequestStatusClass, REQ_STATUS} from "../../helpers/utils";
import {getErrorMessage, LINE_SEND_ERR, showError} from "../../helpers/ui-msg";
import {useApi} from "../../helpers/api";

function LineInput({poemId, setPoem}) {
    let api = useApi();
    const [newLineInput, setNewLineInput] = useState("");
    const [completePoemInput, setCompletePoemInput] = useState(false);
    const [submitLineStatus, setSubmitLineStatus] = useState(REQ_STATUS.NOT_STARTED);

    const submitLine = () => {
        let content = newLineInput;
        if (!content || !content.length || content.length === 0) return;

        setSubmitLineStatus(REQ_STATUS.LOADING)
        api.submitLine(poemId, content, completePoemInput).then(response => {
            if (response.status === "success") {
                // Line successfully submitted, Poem is inside response.
                setSubmitLineStatus(REQ_STATUS.SUCCESS);
                setTimeout(() => setSubmitLineStatus(REQ_STATUS.NOT_STARTED), 500)
                setPoem(response.data)
                setNewLineInput("");
            } else {
                setSubmitLineStatus(REQ_STATUS.FAIL);
                showError(getErrorMessage(LINE_SEND_ERR));
                console.error(response.message);
            }
        });
    };

    const inputValid = () => newLineInput.length > 0;
    const handleNewLineInput = (event) => {
        setNewLineInput(event.target.value)
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValid()) {
            submitLine()
        }
    }
    const handleCompletePoemInput = (event) => setCompletePoemInput(event.target.checked)

    return <div>
        <input required={true} maxLength={42}
               className={"line poem-input-field " + getRequestStatusClass(submitLineStatus)}
               value={newLineInput} onChange={handleNewLineInput}
               type="text" onKeyDown={handleKeyDown} autoFocus={true} placeholder="Go off..."/>
        <div className={"add-line-input-con " + (inputValid() ? "" : "hidden")}>
                <span className={"add-line-input-complete-con"}>
                    <input type="checkbox" id="completePoemCheckbox" checked={completePoemInput}
                           onChange={handleCompletePoemInput}/>
                    <label htmlFor={"completePoemCheckbox"}>My line should end the poem. <span
                        className={"small-label-subtext"}>starts vote among your co-authors</span></label>
                </span>
            <span className={"add-poem-btn"} onClick={submitLine}>Add Line<span className="pen-emoji"/>️</span>
        </div>
    </div>
}
export default LineInput;
