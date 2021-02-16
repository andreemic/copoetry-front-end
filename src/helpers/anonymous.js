import React, {createContext, useReducer} from "react";

const ANON_STORAGE_KEY = 'copoetry-anon';

const AnonReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_ANONYMOUS':
            window.localStorage.setItem(ANON_STORAGE_KEY, JSON.stringify(!state.anonymous));
            return {
                ...state,
                anonymous: !state.anonymous
            };
        case 'SET_ANONYMOUS':
            window.localStorage.setItem(ANON_STORAGE_KEY, JSON.stringify(action.payload));
            return {
                ...state,
                anonymous: action.payload
            };
        case 'SET_NEEDS_TO_VOTE':
            return {
                ...state,
                needsToVote: action.payload
            };
        case 'SET_REGISTERED':
            return {
                ...state,
                registered: action.payload
            }
        default:
            return state;
    }
};
const initialState = {
    anonymous: JSON.parse(window.localStorage.getItem(ANON_STORAGE_KEY)),
    needsToVote: false,
    registered: false
};
const Store = ({children}) => {
    const [state, dispatch] = useReducer(AnonReducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;
