import { createContext, ReactNode, useContext } from 'react';

interface GameProviderProps {
  children: ReactNode;
}

interface GameContext {
  onBackButtonClick?: () => void;
}

export const gameContext = createContext<GameContext>({});

export const GameProvider = ({ children }: GameProviderProps) => {
  const game = useProvideGame();
  return <gameContext.Provider value={game}>{children}</gameContext.Provider>;
};

export const useGame = () => {
  return useContext(gameContext);
};

export const useProvideGame = () => {
  const context: GameContext = {};

  return context;
};
