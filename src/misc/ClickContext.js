import { createContext, useState, useContext } from "react";

const ClickContext = createContext();

export function ClickProvider({ children }) {
  const [clickInfo, setClickInfo] = useState({ clicked: false, source: null });

  const handleClick = (source) => {
    setClickInfo({ clicked: true, source });
  };

  return (
    <ClickContext.Provider value={{ clickInfo, handleClick, setClickInfo }}>
      {children}
    </ClickContext.Provider>
  );
}

export const useClickContext = () => useContext(ClickContext);
