const GAME_STATE_KEY = 'termoGameState';
const GAME_SOLUTION_KEY = 'termoGameSolution';

type GameState = {
    puzzleDate: string;
    guesses: Array<string>;
    solution?: string;
};

const getTodayPuzzleDate = () => {
    return new Date().toISOString().split('T')[0]
}

export const getStoredGameState = () => {
    const gameStateStr = localStorage.getItem(GAME_STATE_KEY);
    if (!gameStateStr) {
        return [];
    }
    const gameState = JSON.parse(gameStateStr) as GameState;
    if (gameState.puzzleDate !== getTodayPuzzleDate()) {
        return [];
    }
    return gameState.guesses;
};

export const getStoredSolution = (): string | null => {
    const gameStateStr = localStorage.getItem(GAME_STATE_KEY);
    if (!gameStateStr) {
        return null;
    }
    const gameState = JSON.parse(gameStateStr) as GameState;
    if (gameState.puzzleDate !== getTodayPuzzleDate()) {
        return null;
    }
    return gameState.solution || null;
};

export const setStoredGameState = (guesses: Array<string>, solution: string) => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify({
        puzzleDate: getTodayPuzzleDate(),
        guesses,
        solution,
    }))
};

export const clearStoredGameState = () => {
    localStorage.removeItem(GAME_STATE_KEY);
    localStorage.removeItem(GAME_SOLUTION_KEY);
};