import { toast } from 'react-toastify';
const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export function showSuccess(msg) {
    toast.success(msg, options);
}

export function showError(msg) {
    toast.error(msg, options);
}

export function showInfo(msg) {
    toast.info(msg, options);
}

export const LINE_SEND_ERR = 0;
export const POEM_SEND_ERR = 1;
const errorMsgs = {
    LINE_SEND_ERR: ["Your line got lost in delivery... Try again?", "Can't add this line right now...",
        "Remember the line and try later. Something's not working right.", "Oops... That didn't work. Try again?"],
    POEM_SEND_ERR: ["Can't do that... Try reloading.", "Try adding this poem later.",
        "That didn't work... Reload the page and try again."]
}
export function getErrorMessage(errNum) {
    if (!errorMsgs.hasOwnProperty(errNum)) return "That didn't work... Please try again later."
    let possibleMessages = errorMsgs[errNum];
    return possibleMessages[Math.floor(Math.random()*possibleMessages.length)]
}
