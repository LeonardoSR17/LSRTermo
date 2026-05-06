import classNames from "classnames";
import { GAME_WORLD_LEN, type letterState } from "../constants";
import css from './GuessRow.module.css';
import { useEffect, useState } from "react";

type Props = { guess: string | undefined; letterStates: Array<letterState>; shake: boolean; jump: boolean;};

export const GuessRow = ({ guess, letterStates, shake, jump }: Props) => {
    return <div className={classNames("flex gap-1", {[css.shake]: shake})}>
        {Array.from({length: GAME_WORLD_LEN}).map((_, idx) => {
            return <Tile key={idx} idx={idx} letter={guess ? guess[idx]: ''} state={letterStates[idx]} jump={jump}/>
        })}
    </div>;
}

type TileProps = {
    letter: string | undefined;
    state: letterState;
    idx: number;
    jump: boolean;
}

export const Tile = ({ letter, state, idx, jump } : TileProps) => {
    const [revealColor, setRevealColor] = useState(false);
    const animationDelay = jump ? idx * 80 : idx * 300;
    useEffect(() => {
        let timeout: number;
        if (state !== 'default') {
            timeout = setTimeout(() => {
                setRevealColor(true);
            }, animationDelay + 300);
        }
        return () => clearTimeout(timeout);
    }, [state]);
    return <div
    style={{animationDelay: state === 'default'? '0ms' : `${animationDelay}ms`}} 
    className={classNames(
        "border w-16 h-16 flex justify-center items-center text-3xl font-bold",
        {[css.hasLetter]: !! letter, 'border-gray-500': state === 'default' && !letter, [css.correct]: state === 'correct' && revealColor, [css.wrong]: state === 'wrong' && revealColor, [css.wrongPlace]: state === 'wrong-place' && revealColor, [css.flip]: state !== 'default', [css.jump]: jump,}
        )}>
        {letter}</div>
};