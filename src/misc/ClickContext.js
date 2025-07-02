import { createContext, useState, useContext } from "react";

const ClickContext = createContext();

export function ClickProvider({ children }) {
  const [clicked, setClicked] = useState(false);

  return (
    <ClickContext.Provider value={{ clicked, setClicked }}>
      {children}
    </ClickContext.Provider>
  );
}

export const useClickContext = () => useContext(ClickContext);
