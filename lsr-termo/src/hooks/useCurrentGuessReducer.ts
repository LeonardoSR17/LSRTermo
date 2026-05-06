import { useReducer } from "react"
import { GAME_WORLD_LEN } from "../constants";

type AddLetterAction = {
    type: 'add';
    letter: string;
}

type BackspaceAction = {
    type: 'Backspace';
}

type CleanAction  = {
    type: 'clear';
}

type Action = AddLetterAction | BackspaceAction | CleanAction;

const reducer = (state: string, action: Action) => {
    if (action.type === 'add') {
        if (state.length === GAME_WORLD_LEN) {
            return state;
        }
        return state + action.letter;
    }
    if (action.type === 'Backspace') {
        if (state.length !== 0) {
            return state.substring(0, state.length - 1)
        }
    }
    if (action.type === 'clear') {
        return '';
    }
    return state
};

export const useCurrentGuessReducer =  () => {
    return useReducer(reducer, '');
}