import { useState, useEffect } from "react";
import "@theme-toggles/react/css/Classic.css";
import { Classic } from "@theme-toggles/react";

import '../CSS/ThemeSwitch.css';

function ThemeSwitch() {

  const [dark, setDark] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  function changeThemeDevice(e) {
    setDark(e.matches ? true : false);
    localStorage.setItem("theme", e.matches ? "dark" : "light");
  }

  function toggleTheme() {
    setDark(!dark);
    localStorage.setItem("theme", !dark ? "dark" : "light");
  }

  useEffect(() => {
    // check for already stored theme preference
    const pref = localStorage.getItem("theme");
    if (pref) {
      setDark(pref === "dark" ? true : false);
    }
    // event listener for changes to user's theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', changeThemeDevice);
    return () => {
      mediaQuery.removeEventListener('change', changeThemeDevice);
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? "dark" : "light");
  }, [dark])

  return (
    <div className="ThemeSwitch" onClick={toggleTheme}>
      <Classic toggled={dark} duration={750} />
    </div>
  )
}

export default ThemeSwitch;
