import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({ theme: 'light', setTheme: () => {} });

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        const saved = localStorage.getItem('erp-theme');
        if (saved) return saved;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    });

    const setTheme = (t) => {
        setThemeState(t);
        localStorage.setItem('erp-theme', t);
    };

    useEffect(() => {
        const root = document.documentElement;
        const effective =
            theme === 'system'
                ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                : theme;
        root.setAttribute('data-theme', effective);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
