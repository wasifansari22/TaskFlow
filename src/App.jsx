import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const theme = useSelector((state) => state.settings.theme);

  useEffect(() => {
    const root = document.documentElement
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const shouldUseDark =
        theme === "dark" ||
        (theme === "system" && systemPreference.matches);

      root.classList.toggle("dark", shouldUseDark);
    };

    applyTheme();

    systemPreference.addEventListener("change", applyTheme);

    return () => {
      systemPreference.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;