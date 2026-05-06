import classNames from "classnames";
import { BACKSPACE, ENTER, GAME_ROUNDS, GAME_WORLD_LEN, type letterState } from "../constants";
import { GuessRow } from "./GuessRow";
import { Keyboard } from "./Keyboard";

import css from './Game.module.css';
import { useCallback, useEffect, useRef, useState } from "react";
import { useCurrentGuessReducer } from "../hooks/useCurrentGuessReducer";
import { isValidWord } from "../utils/isValidWord";
import { getTileStates } from "../utils/getTileStates";
import { getStoredGameState, setStoredGameState, getStoredSolution, clearStoredGameState } from "../utils/gameStateStorage";
import { getRandomWord } from "../utils/getRandomWord";

type GameProps = {
  resetTrigger?: number;
};

export const Game = ({ resetTrigger }: GameProps) => {
    const [solution, setSolution] = useState<string>(() => {
        const storedSolution = getStoredSolution();
        if (storedSolution) {
            console.log('Usando solução salva:', storedSolution);
            return storedSolution;
        }
        const newSolution = getRandomWord();
        console.log('Gerando nova solução:', newSolution);
        return newSolution;
    });
    
    const [currentGuess, dispatch] = useCurrentGuessReducer();
    const [guesses, setGuesses] = useState<Array<string>>(() => {
      const stored = getStoredGameState();
      return stored;
    });
    const [gameCompletionState, setGameCompletion] = useState<'active' | 'won' | 'lost'>('active');
    const [toastText, setToastText] = useState('');
    const toastTimeout = useRef<number | undefined>(undefined);
    const [shakeCurrentRow, setShakeCurrentRow] = useState(false);
    const shakeTimeout = useRef<number | undefined>(undefined);

    useEffect(() => {
      if (resetTrigger && resetTrigger > 0) {
        console.log('Resetando jogo...');
        const newSolution = getRandomWord();
        setSolution(newSolution);
        setGuesses([]);
        dispatch({ type: 'clear' });
        setGameCompletion('active');
        setToastText('');
        clearStoredGameState(); 
      }
    }, [resetTrigger, dispatch]);

    useEffect(() => {
        console.log('Palavra do dia:', solution);
    }, [solution]);

    const setGuessesCallback = useCallback((guesses: Array<string>) => {
        setGuesses(guesses);
        setStoredGameState(guesses, solution);
    }, [setGuesses, solution]);

    const showToast = useCallback((text: string) => {
        clearTimeout(toastTimeout.current)
        setToastText(text);
        toastTimeout.current = setTimeout(() => {
            setToastText('')
        }, 1500);
        return () => clearTimeout(toastTimeout.current);
    }, [setToastText, toastTimeout]);

    const shakeCurrentGuess = useCallback(() => {
        clearTimeout(shakeTimeout.current);
        setShakeCurrentRow(true);
        shakeTimeout.current = setTimeout(() => {
            setShakeCurrentRow(false)
        }, 650)
        return () => clearTimeout(shakeTimeout.current);
    }, [shakeTimeout])

    const submitWord = useCallback(() => {
        if (currentGuess.length !== GAME_WORLD_LEN) {
            showToast('Entrada insuficiente!');
            shakeCurrentGuess();
            return;
        }
        if (!isValidWord(currentGuess)) {
            showToast('Palavra inválida');
            shakeCurrentGuess();
            return;
        }
    
        setGuessesCallback([...guesses, currentGuess])
        dispatch({type: 'clear'});
        if (currentGuess === solution) {
            setTimeout(() => {
                setGameCompletion('won');
            }, 2000)
            setTimeout(() => {
                showToast("Você GANHOU!");
            }, 4000)
            return;
        }
        if (guesses.length + 1 === GAME_ROUNDS) {
            setGameCompletion('lost');
            setTimeout(() => {
                showToast(`Não foi desta vez amigão! A palavra era ${solution}`);              
            }, 2500)
            return;
        } 
    }, [currentGuess, guesses, solution, dispatch, setGuessesCallback, showToast, shakeCurrentGuess]);

    const onKeyPress = useCallback((key: string) => {
        if (gameCompletionState !== 'active') {
            return;
        }
        if (key === BACKSPACE) {
            dispatch({type: 'Backspace'});
            return;
        }
        
        if (key === ENTER) {
            submitWord();
            return;
        }

        if (key.length !== 1 || !/[a-z]|[A-Z]/.test(key)) {
            return;
        }
        dispatch({type: 'add', letter: key.toUpperCase()});
    },[dispatch, submitWord, gameCompletionState]);
    
    const onKeyDownEvt = useCallback((evt: KeyboardEvent) => {
        onKeyPress(evt.key);
    }, [onKeyPress]);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDownEvt);
        return () => window.removeEventListener('keydown', onKeyDownEvt);
    }, [onKeyDownEvt])

    const guessIdxToTileStates = Array.from({length: GAME_ROUNDS}).map((_, idx) => {
        const isSubmitted = idx < guesses.length;
        return getTileStates(solution, guesses[idx], isSubmitted);
    });

    const letterToLetterState: {[letter: string]: letterState} = {};
    guessIdxToTileStates.forEach((tileStates, idx) => {
        const guess = guesses[idx];
        if (!guess) {
            return;
        }
        tileStates.forEach((tileState, letterIdx) => {
            const letter = guess[letterIdx];
            if (tileState === 'correct' || letterToLetterState[letter] === 'correct') {
                letterToLetterState[letter] = 'correct';
                return;
            }
            if (tileState === 'wrong-place' || letterToLetterState[letter] === 'wrong-place') {
                letterToLetterState[letter] = 'wrong-place';
                return;
            }
            if (tileState === 'wrong') {
                letterToLetterState[letter] = 'wrong';
            }
        });
    });

    return (
        <div className="w-full h-full flex justify-center">
            {toastText && (
                <div className={classNames(css.toast, "absolute m-4 font-bold bg-slate-500 p-4 rounded-md z-10")}>{toastText}</div>
            )}
            <div className="w-full max-w-lg max-h-[700px] flex flex-col items-center justify-between py-10">
                <div className="flex flex-col gap-2">
                    {Array.from({length: GAME_ROUNDS}).map((_, idx) => {
                        const isCurrentGuess = idx === guesses.length;
                        return <GuessRow key={idx} guess={isCurrentGuess ? currentGuess : guesses[idx]} letterStates={guessIdxToTileStates[idx]} shake={shakeCurrentRow && isCurrentGuess} jump={gameCompletionState === 'won' && idx === guesses.length -1}/>
                    })}
                </div>
                <Keyboard onKeyPress={onKeyPress} letterToLetterState={letterToLetterState}/>
            </div>
        </div>
    );
}