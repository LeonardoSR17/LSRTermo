type Props = {
    onNewGame?: () => void;
}

export const Header = ({ onNewGame }: Props) => {
    return (
        <div className="w-full h-12 md:h-16 flex justify-between items-center px-4 border-b border-gray-600">
            <h1>LSR Termo</h1>
            {onNewGame && (
                <button 
                    onClick={onNewGame}
                    className="px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
                >
                    Novo Jogo
                </button>
            )}
        </div>
    );
}