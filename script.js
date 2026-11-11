(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById("language-toggle");
  const themeButton = document.getElementById("theme-toggle");
  const themeLabel = themeButton.querySelector(".theme-label");
  const description = document.querySelector('meta[name="description"]');
  const translatedElements = document.querySelectorAll("[data-i18n]");
  const translatedAttributes = document.querySelectorAll("[data-i18n-aria]");
  const translatedAltText = document.querySelectorAll("[data-i18n-alt]");
  const english = {
    darkMode: "Dark mode",
    lightMode: "Light mode",
    switchDark: "Switch to dark mode",
    switchLight: "Switch to light mode",
    switchLanguage: "Switch to Gujarati",
    pageTitle: document.title,
    pageDescription: description.content
  };

  translatedElements.forEach((element) => {
    english[element.dataset.i18n] = element.innerHTML;
  });
  translatedAttributes.forEach((element) => {
    english[element.dataset.i18nAria] = element.getAttribute("aria-label");
  });
  translatedAltText.forEach((element) => {
    english[element.dataset.i18nAlt] = element.getAttribute("alt");
  });

  function readPreference(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("Unable to read saved site preferences:", error);
      return null;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("Unable to save site preferences:", error);
    }
  }

  let language = readPreference("shreedhar-language") === "gu" ? "gu" : "en";
  const savedTheme = readPreference("shreedhar-theme");
  let theme = savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  function render() {
    const copy = language === "gu" ? gujarati : english;
    root.lang = language;
    root.dataset.theme = theme;
    translatedElements.forEach((element) => {
      element.innerHTML = copy[element.dataset.i18n];
    });
    translatedAttributes.forEach((element) => {
      element.setAttribute("aria-label", copy[element.dataset.i18nAria]);
    });
    translatedAltText.forEach((element) => {
      element.setAttribute("alt", copy[element.dataset.i18nAlt]);
    });
    document.title = copy.pageTitle;
    description.content = copy.pageDescription;
    languageButton.textContent = language === "en" ? "ગુજરાતી" : "English";
    languageButton.lang = language === "en" ? "gu" : "en";
    languageButton.setAttribute("aria-label", copy.switchLanguage);
    themeLabel.textContent = theme === "dark" ? copy.lightMode : copy.darkMode;
    themeButton.setAttribute("aria-label", theme === "dark" ? copy.switchLight : copy.switchDark);
    themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  }

  languageButton.addEventListener("click", () => {
    language = language === "en" ? "gu" : "en";
    savePreference("shreedhar-language", language);
    render();
  });
  themeButton.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    savePreference("shreedhar-theme", theme);
    render();
  });
  render();
  languageButton.hidden = false;
  themeButton.hidden = false;
})();
