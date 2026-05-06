import { useState } from "react";
import { Game } from "./components/Game";
import { Header } from "./components/Header";

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
    <div className='flex flex-col h-full'>
      <Header onNewGame={handleNewGame}/>
      <Game key={gameKey} resetTrigger={resetTrigger} />
    </div>
  )
}

export default App;