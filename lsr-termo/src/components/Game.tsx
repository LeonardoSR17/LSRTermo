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
      return storedSolution;
    }
    return getRandomWord();
  });
  
  const [currentGuess, dispatch] = useCurrentGuessReducer();
  const [guesses, setGuesses] = useState<Array<string>>(() => {
    return getStoredGameState();
  });
  const [gameCompletionState, setGameCompletion] = useState<'active' | 'won' | 'lost'>('active');
  const [toastText, setToastText] = useState('');
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [shakeCurrentRow, setShakeCurrentRow] = useState(false);
  const shakeTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      const newSolution = getRandomWord();
      setSolution(newSolution);
      setGuesses([]);
      dispatch({ type: 'clear' });
      setGameCompletion('active');
      setToastText('');
      clearStoredGameState();
    }
  }, [resetTrigger, dispatch]);

  const setGuessesCallback = useCallback((guesses: Array<string>) => {
    setGuesses(guesses);
    setStoredGameState(guesses, solution);
  }, [setGuesses, solution]);

  const showToast = useCallback((text: string) => {
    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }
    setToastText(text);
    toastTimeout.current = setTimeout(() => {
      setToastText('');
    }, 2000);
  }, []);

  const shakeCurrentGuess = useCallback(() => {
    if (shakeTimeout.current) {
      clearTimeout(shakeTimeout.current);
    }
    setShakeCurrentRow(true);
    shakeTimeout.current = setTimeout(() => {
      setShakeCurrentRow(false);
    }, 600);
  }, []);

  const submitWord = useCallback(() => {
    if (currentGuess.length !== GAME_WORLD_LEN) {
      showToast('Palavra muito curta');
      shakeCurrentGuess();
      return;
    }
    if (!isValidWord(currentGuess)) {
      showToast('Palavra inválida');
      shakeCurrentGuess();
      return;
    }
  
    setGuessesCallback([...guesses, currentGuess]);
    dispatch({ type: 'clear' });
    
    if (currentGuess === solution) {
      setTimeout(() => {
        setGameCompletion('won');
      }, 1800);
      setTimeout(() => {
        showToast("Você GANHOU!");
      }, 3500);
      return;
    }
    
    if (guesses.length + 1 === GAME_ROUNDS) {
      setGameCompletion('lost');
      setTimeout(() => {
        showToast(`A palavra era ${solution}`);
      }, 2500);
      return;
    }
  }, [currentGuess, guesses, solution, dispatch, setGuessesCallback, showToast, shakeCurrentGuess]);

  const onKeyPress = useCallback((key: string) => {
    if (gameCompletionState !== 'active') {
      return;
    }
    if (key === BACKSPACE) {
      dispatch({ type: 'Backspace' });
      return;
    }
    if (key === ENTER) {
      submitWord();
      return;
    }
    if (key.length !== 1 || !/[a-zA-Z]/.test(key)) {
      return;
    }
    dispatch({ type: 'add', letter: key.toUpperCase() });
  }, [dispatch, submitWord, gameCompletionState]);

  const onKeyDownEvt = useCallback((evt: KeyboardEvent) => {
    onKeyPress(evt.key);
  }, [onKeyPress]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDownEvt);
    return () => window.removeEventListener('keydown', onKeyDownEvt);
  }, [onKeyDownEvt]);

  const guessIdxToTileStates = Array.from({ length: GAME_ROUNDS }).map((_, idx) => {
    const isSubmitted = idx < guesses.length;
    return getTileStates(solution, guesses[idx], isSubmitted);
  });

  // CORREÇÃO: Tipagem explícita e verificações de undefined
  const letterToLetterState: Record<string, letterState> = {};
  
  guessIdxToTileStates.forEach((tileStates, idx) => {
    const guess = guesses[idx];
    if (!guess) return;
    
    tileStates.forEach((tileState, letterIdx) => {
      const letter = guess[letterIdx];
      if (!letter) return;
      
      const currentState = letterToLetterState[letter];
      
      if (tileState === 'correct') {
        letterToLetterState[letter] = 'correct';
      } else if (tileState === 'wrong-place' && currentState !== 'correct') {
        letterToLetterState[letter] = 'wrong-place';
      } else if (tileState === 'wrong' && !currentState) {
        letterToLetterState[letter] = 'wrong';
      }
    });
  });

    return (
        <div className="w-full h-full flex flex-col justify-center items-center relative">
        {toastText && (
            <div className={classNames(css.toast, "absolute top-[2%] md:top-[5%] left-1/2 transform -translate-x-1/2 z-10 px-6 py-3 md:px-8 md:py-4")}>
            {toastText}
            </div>
        )}
        
        <div className="w-full max-w-lg flex flex-col items-center justify-between flex-1 py-3 md:py-5 px-4">
            {/* Grade de palavras - tiles maiores com gap adequado */}
            <div className="flex flex-col gap-2.5 md:gap-3.5 mb-auto mt-auto">
            {Array.from({ length: GAME_ROUNDS }).map((_, idx) => {
                const isCurrentGuess = idx === guesses.length;
                return (
                <GuessRow
                    key={idx}
                    guess={isCurrentGuess ? currentGuess : guesses[idx]}
                    letterStates={guessIdxToTileStates[idx]}
                    shake={shakeCurrentRow && isCurrentGuess}
                    jump={gameCompletionState === 'won' && idx === guesses.length - 1}
                />
                );
            })}
            </div>
            
            {/* Espaçamento maior entre grade e teclado */}
            <div className="h-[3vh] md:h-8" />
            
            {/* Teclado - mesma largura máxima */}
            <div className="w-full max-w-md">
            <Keyboard onKeyPress={onKeyPress} letterToLetterState={letterToLetterState} />
            </div>
        </div>
        </div>
    );
};