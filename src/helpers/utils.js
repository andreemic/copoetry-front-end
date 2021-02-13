export const REQ_STATUS = {
    NOT_STARTED: 0,
    LOADING: 1,
    SUCCESS: 2,
    FAIL: 3
};
/*
 * Returns CSS class name corresponidng to request status.
 * Used all across the App with according CSS classes.
 */
export function getRequestStatusClass(status) {
    switch(status) {
        case REQ_STATUS.NOT_STARTED:
            return "req-not-started"
        case REQ_STATUS.LOADING:
            return "req-pending"
        case REQ_STATUS.SUCCESS:
            return "req-success"
        case REQ_STATUS.FAIL:
            return "req-fail"
    }
    return ""
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function timestampToShortString(t, withOn=false) {
    let date = new Date(t);
    let day = date.getDate();

    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];

    let year = date.getFullYear();
    let now = new Date();
    if (year === now.getFullYear() && monthIndex === now.getMonth() && day === now.getDate())
        return `today`
    if (year === now.getFullYear() && monthIndex === now.getMonth() && day === now.getDate()-1)
        return `yesterday`
    else if (year === now.getFullYear())
        return `${withOn ? "on " : ""}${day} ${monthName}`;
    else
        return `${withOn ? "on " : ""}${day} ${monthName} ${year}`;
}

export function getActiveVotingFromPoem(poem) {
    if (!poem || !Array.isArray(poem.completionVotings)) return null;
    let filteredVotings = poem.completionVotings.filter(v => v.state === "active")
    if (filteredVotings.length < 1) return null;
    return filteredVotings[0] // More than one at a time not expected
}

export function getPoemDateCompleted(poem) {
    if (!poem || !Array.isArray(poem.completionVotings) || poem.completionVotings.length < 1) return null;
    let filteredVotings = poem.completionVotings.filter(v => v.state === "stopped");
    if (filteredVotings.length < 1) return null;
    return filteredVotings[0].dateEnded // More than one at a time not expected
}
