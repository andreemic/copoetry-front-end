import React from "react";
import {showError, showSuccess} from "../../helpers/ui-msg";
import {useApi} from "../../helpers/api";

function PoemVoting({voting, setPoem, user}) {
    let api = useApi();
    const onVoteInput = (event) => {
        let forCompletingPoem = (event.target.id === "voteCompletePoemCheckbox");
        api.castCompletionVote(voting.id, forCompletingPoem).then(response => {
            if (response.status === "success") {
                api.updateNeedsToVote();
                setPoem(response.data);
                try {
                    showSuccess(response.data.completed ? `You had the final word. "${response.data.title}" is complete.` :
                        (response.data.completionVotings.filter(v => v.id === voting.id)[0].status === "stopped"
                            ? "Vote casted. The Poem goes on." : "Vote casted."))
                } catch (e) {
                    showSuccess("Vote casted.")
                }
            } else {
                event.target.checked = false;
                showError(response.message);
            }
        })
    };

    return <div className={"poem-active-voting"}>
            <span className={"poem-active-voting-title"}>
                {voting.creator === user.nickname ? "You thought" : voting.creator + " thinks"} it's time to wrap this poem up.
            </span>
        {voting.userVoted ?
            <div className={"poem-active-voting-info"}>
                {voting.votesFor + voting.votesAgainst > 3 ? (voting.votesFor > voting.votesAgainst ?
                    "Most of your co-authors agree." :
                    (voting.votesFor === voting.votesAgainst ?
                        "Oh, this is a controversial one! It's a tie." : "Most of your co-authors do not agree"))
                    : (voting.creator === user.nickname ? "Let's see what the others say..." : "")}
            </div>
            : <div className={"poem-active-voting-choice-con"}>
                What do you think?
                <div className={"poem-active-voting-input-con"}>
                        <span className={"poem-active-voting-input"}>
                            <input type="checkbox" id="voteCompletePoemCheckbox" onChange={onVoteInput}/>
                            <label htmlFor={"voteCompletePoemCheckbox"}>Agreed.</label>
                        </span>
                    <span className={"poem-active-voting-input"}>
                            <input type="checkbox" id="voteContinuePoemCheckbox" onChange={onVoteInput}/>
                            <label htmlFor={"voteContinuePoemCheckbox"}>Not so fast...</label>
                        </span>
                </div>
            </div>}
    </div>
}

export default PoemVoting;
