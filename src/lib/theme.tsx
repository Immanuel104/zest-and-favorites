import { createContext, useContext, useState, type ReactNode } from "react";

type ThemeCtx = { dark: boolean; toggle: () => void };
const ThemeContext = createContext<ThemeCtx>({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      <div className={dark ? "dark" : undefined}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
