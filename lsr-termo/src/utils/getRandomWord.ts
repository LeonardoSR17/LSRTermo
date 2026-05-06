import allowedWords from '../config/allowed_words.json';

export const getRandomWord = () => {
  const wordsList = allowedWords as string[];
  
  console.log('Total de palavras carregadas:', wordsList.length);
  console.log('Primeiras 5 palavras:', wordsList.slice(0, 5));
  
  if (!wordsList || wordsList.length === 0) {
    console.error('Lista de palavras vazia!');
    return 'TERMO';
  }
  
  const randomIndex = Math.floor(Math.random() * wordsList.length);
  const word = wordsList[randomIndex];
  
  console.log('Índice sorteado:', randomIndex);
  console.log('Palavra sorteada:', word);
  
  return word.toUpperCase();
};