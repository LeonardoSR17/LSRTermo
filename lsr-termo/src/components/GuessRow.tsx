import classNames from "classnames";
import { GAME_WORLD_LEN, type letterState } from "../constants";
import css from './GuessRow.module.css';
import { useEffect, useState } from "react";

type Props = {
  guess: string | undefined;
  letterStates: Array<letterState>;
  shake: boolean;
  jump: boolean;
};

export const GuessRow = ({ guess, letterStates, shake, jump }: Props) => {
  return (
    <div className={classNames("flex gap-2.5 md:gap-3.5", { [css.shake]: shake })}>
      {Array.from({ length: GAME_WORLD_LEN }).map((_, idx) => {
        return (
          <Tile
            key={idx}
            idx={idx}
            letter={guess ? guess[idx] : ''}
            state={letterStates[idx]}
            jump={jump}
          />
        );
      })}
    </div>
  );
};

type TileProps = {
  letter: string | undefined;
  state: letterState;
  idx: number;
  jump: boolean;
};

export const Tile = ({ letter, state, idx, jump }: TileProps) => {
  const [revealColor, setRevealColor] = useState(false);
  const animationDelay = jump ? idx * 80 : idx * 300;
  
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (state !== 'default') {
      timeout = setTimeout(() => {
        setRevealColor(true);
      }, animationDelay + 300);
    }
    return () => clearTimeout(timeout);
  }, [state, animationDelay]);

  return (
    <div
      style={{
        animationDelay: state === 'default' ? '0ms' : `${animationDelay}ms`
      }}
      className={classNames(
        css.tile,
        {
          [css.hasLetter]: !!letter,
          [css.correct]: state === 'correct' && revealColor,
          [css.wrong]: state === 'wrong' && revealColor,
          [css.wrongPlace]: state === 'wrong-place' && revealColor,
          [css.flip]: state !== 'default',
          [css.jump]: jump,
        }
      )}
    >
      <span className="font-extrabold leading-none">{letter}</span>
    </div>
  );
};