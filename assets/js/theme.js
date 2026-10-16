(function initialiseSiteChrome() {
  const root = document.documentElement;
  const storageKey = "munnar-surprise-theme";
<<<<<<< HEAD
  const preferredTheme = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
=======
  const preferredTheme = "light";
>>>>>>> origin/master
  let savedTheme;
  try { savedTheme = localStorage.getItem(storageKey); } catch (error) { savedTheme = null; }

  function setTheme(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem(storageKey, theme); } catch (error) { /* Theme still works when storage is unavailable. */ }
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const isDark = theme === "dark";
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      button.innerHTML = `<i class="fa-solid fa-${isDark ? "sun" : "moon"}"></i><span>${isDark ? "Light" : "Dark"}</span>`;
    });
  }

  setTheme(savedTheme || root.dataset.theme || preferredTheme);
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => button.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  }));

  const menuButton = document.getElementById("menuBtn");
  const mobileNavigation = document.getElementById("mobileNav");
  if (menuButton && mobileNavigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = mobileNavigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      menuButton.innerHTML = `<i class="fa-solid fa-${isOpen ? "xmark" : "bars"}"></i>`;
    });

    mobileNavigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      mobileNavigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }));
  }
}());
