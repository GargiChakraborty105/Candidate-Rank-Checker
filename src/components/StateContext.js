import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

  return (
    <StateContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
