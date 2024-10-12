import { useEffect, useState } from 'react';

function SwitchTheme() {

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  return (
    <button className="flex items-center" title="Change Theme" type="button" onClick={toggleTheme}>
      {theme === 'dark' ? (
        <span className="material-symbols-outlined text-2xl xl:ml-2 xl:text-4xl" title="Light Mode">
          light_mode
        </span>
      ) : (
        <span className="material-symbols-outlined text-2xl text-primary xl:ml-2 xl:text-4xl" title="Dark Mode">
          dark_mode
        </span>
      )}
    </button>
  );
}

export default SwitchTheme;
