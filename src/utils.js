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
export function timestampToShortString(t) {
    let date = new Date(t);
    let day = date.getDate();

    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];

    let year = date.getFullYear();
    let now = new Date();
    if (year === now.getFullYear() && monthIndex === now.getMonth() && day === now.getDate())
        return `today`
    else if (year === now.getFullYear())
        return `${day} ${monthName}`;
    else
        return `${day} ${monthName} ${year}`;
}
