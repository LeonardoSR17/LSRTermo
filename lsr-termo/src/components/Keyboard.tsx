import classNames from 'classnames/bind';
import css from './Keyboard.module.css';
import { BACKSPACE, ENTER, type letterState as letterState } from '../constants';

const cx = classNames.bind(css);

const ROWS = [
    'QWERTYUIOP'.split(''),
    ' ASDFGHJKL '.split(''),
    [ENTER, ...'ZXCVBNM'.split(''), BACKSPACE]
]

type Props = {
    onKeyPress: (Key: string) => void;
    letterToLetterState: {[letter: string]: letterState}
};

export const Keyboard = ({ onKeyPress, letterToLetterState }: Props) => {
    return (
        <div className="w-full flex flex-col gap-1">
            {ROWS.map((letters, idx) => {
                return (
                    <div className="flex w-full gap-1" key={idx}>
                        {letters.map((letter, idx) => {
                            return (
                                <Key key={idx} letter={letter} onKeyPress={onKeyPress} letterState={letterToLetterState[letter] ?? 'default'}/>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

type KeyProps = {
    letter: string;
    onKeyPress: (Key: string) => void;
    letterState: letterState;
}

export const Key = ({ letter, onKeyPress, letterState}: KeyProps) => {
    if (letter ===' ') {
        return <div className={css.spacer} />
    }

    return <button className={cx({['flex-1']: letter !== ENTER && letter !== BACKSPACE, [css.largeKey]: letter === ENTER || letter === BACKSPACE, [css.defaultKey]: letterState === 'default' , [css.correct]: letterState === 'correct', [css.wrong]: letterState === 'wrong', [css.wrongPlace]: letterState === 'wrong-place' },'flex justify-center items-center rounded-md flex-1 h-14 font-bold text-lg')} onClick={() => onKeyPress(letter)}>
            {letter === BACKSPACE ? (
                <svg 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    width="20" 
                    data-testid="icon-backspace"
                >
                    <path 
                        fill="white" 
                        d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
                    ></path>
                </svg>
            ) : (letter)
            }
        </button>
}