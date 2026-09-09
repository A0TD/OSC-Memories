import  { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // قراءة الثيم المحفوظ في localStorage أو اعتماد 'dark' كافتراضي
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('osc_theme') || 'dark';
  });

  useEffect(() => {
    // تطبيق الـ Theme كـ attribute على عنصر <html> لتسهيل التنسيق في CSS
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('osc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};