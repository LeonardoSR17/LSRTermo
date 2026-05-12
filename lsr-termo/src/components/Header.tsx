import { useState } from "react";
import { HelpModal } from "./HelpModal";

type Props = {
  onNewGame?: () => void;
};

export const Header = ({ onNewGame }: Props) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="w-full px-3 py-2 md:px-4 md:py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setShowHelp(true)}
            className="w-9 h-9 md:w-10 md:h-10 bg-[#3f343a] text-white rounded-xl 
                       font-extrabold hover:bg-[#4a3d44] active:scale-95 transition-all
                       text-base md:text-lg border-2 border-[#5a4a53] flex items-center justify-center"
            aria-label="Ajuda"
          >
            ?
          </button>
          <h1 className="text-white tracking-wider text-base md:text-lg">LSR Termo</h1>
        </div>
        
        {onNewGame && (
          <button
            onClick={onNewGame}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-[#3f343a] text-white rounded-xl 
                       font-extrabold hover:bg-[#4a3d44] active:scale-95 transition-all
                       text-xs md:text-sm tracking-wider uppercase border-2 border-[#5a4a53]"
          >
            Novo Jogo
          </button>
        )}
      </header>
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
};