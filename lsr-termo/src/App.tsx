import { useState } from "react";
import { Game } from "./components/Game";
import { Header } from "./components/Header";
import { HelpModal } from "./components/HelpModal";

function App() {
  const [gameKey, setGameKey] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleNewGame = () => {
    localStorage.removeItem('termoGameState');
    localStorage.removeItem('termoGameSolution');
    
    setResetTrigger(prev => prev + 1);
    setGameKey(prev => prev + 1);
  };

  return (
    <div className='flex flex-col h-full min-h-screen'>
      <Header onNewGame={handleNewGame} />
      <main className="flex-1 flex flex-col min-h-0">
        <Game key={gameKey} resetTrigger={resetTrigger} />
      </main>
    </div>
  );
}

export default App;