(() => {
  const root = document.documentElement;
  const languageButton = document.getElementById("language-toggle");
  const themeButton = document.getElementById("theme-toggle");
  const themeLabel = themeButton.querySelector(".theme-label");
  const description = document.querySelector('meta[name="description"]');
  const translatedElements = document.querySelectorAll("[data-i18n]");
  const translatedAttributes = document.querySelectorAll("[data-i18n-aria]");
  const translatedAltText = document.querySelectorAll("[data-i18n-alt]");
  const carousel = document.getElementById("photo-carousel");
  const carouselTrack = document.getElementById("carousel-track");
  const carouselSlides = carouselTrack ? [...carouselTrack.querySelectorAll(".carousel-slide")] : [];
  const carouselDots = carousel ? [...carousel.querySelectorAll(".carousel-dot")] : [];
  const carouselControls = carousel ? carousel.querySelector(".carousel-controls") : null;
  const carouselStatus = document.getElementById("carousel-status");
  const carouselToggle = document.getElementById("carousel-toggle");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const english = {
    darkMode: "Dark mode",
    lightMode: "Light mode",
    switchDark: "Switch to dark mode",
    switchLight: "Switch to light mode",
    switchLanguage: "Switch to Gujarati",
    carouselPlay: "Resume slideshow",
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
  english.carouselStatus = "Photo {current} of {total}";
  english.carouselPlayText = "Play";

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
  let activeSlide = 0;
  let rotationTimer = null;
  let manuallyPaused = false;
  let pointerPaused = false;
  let focusPaused = false;
  let scrollUpdateTimer = null;

  function updateCarouselControls(announce = false) {
    if (!carouselSlides.length) return;
    const copy = language === "gu" ? gujarati : english;
    carouselSlides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== activeSlide));
    });
    carouselDots.forEach((dot, index) => {
      const active = index === activeSlide;
      dot.setAttribute("aria-pressed", String(active));
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    carouselStatus.textContent = copy.carouselStatus
      .replace("{current}", String(activeSlide + 1))
      .replace("{total}", String(carouselSlides.length));
    carouselStatus.setAttribute("aria-live", announce ? "polite" : "off");
    carouselToggle.textContent = manuallyPaused ? copy.carouselPlayText : copy.carouselPauseText;
    carouselToggle.setAttribute("aria-label", manuallyPaused ? copy.carouselPlay : copy.carouselPause);
    carouselToggle.setAttribute("aria-pressed", String(manuallyPaused));
  }

  function stopCarousel() {
    window.clearInterval(rotationTimer);
    rotationTimer = null;
  }

  function startCarousel(force = false) {
    stopCarousel();
    if (
      !carouselSlides.length
      || prefersReducedMotion.matches
      || manuallyPaused
      || pointerPaused
      || document.hidden
      || (focusPaused && !force)
    ) return;
    rotationTimer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
  }

  function showSlide(index, announce = false) {
    activeSlide = (index + carouselSlides.length) % carouselSlides.length;
    const slide = carouselSlides[activeSlide];
    const left = slide.getBoundingClientRect().left - carouselTrack.getBoundingClientRect().left + carouselTrack.scrollLeft;
    carouselTrack.scrollTo({ left, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
    updateCarouselControls(announce);
  }

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
    updateCarouselControls();
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
  if (carouselSlides.length) {
    carousel.querySelector("#carousel-previous").addEventListener("click", () => {
      showSlide(activeSlide - 1, true);
      startCarousel();
    });
    carousel.querySelector("#carousel-next").addEventListener("click", () => {
      showSlide(activeSlide + 1, true);
      startCarousel();
    });
    carouselDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index, true);
        startCarousel();
      });
    });
    carouselToggle.addEventListener("click", () => {
      manuallyPaused = !manuallyPaused;
      updateCarouselControls(true);
      if (manuallyPaused) stopCarousel();
      else startCarousel(true);
    });
    carouselTrack.addEventListener("scroll", () => {
      window.clearTimeout(scrollUpdateTimer);
      scrollUpdateTimer = window.setTimeout(() => {
        if (!carouselTrack.clientWidth) return;
        const index = Math.max(0, Math.min(
          carouselSlides.length - 1,
          Math.round(carouselTrack.scrollLeft / carouselTrack.clientWidth)
        ));
        if (index !== activeSlide) {
          activeSlide = index;
          updateCarouselControls();
        }
      }, 120);
    }, { passive: true });
    carouselTrack.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(activeSlide + (event.key === "ArrowRight" ? 1 : -1), true);
      }
    });
    carousel.addEventListener("pointerenter", () => {
      pointerPaused = true;
      stopCarousel();
    });
    carousel.addEventListener("pointerleave", () => {
      pointerPaused = false;
      startCarousel();
    });
    carousel.addEventListener("focusin", () => {
      focusPaused = true;
      stopCarousel();
    });
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) {
        focusPaused = false;
        startCarousel();
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopCarousel();
      else startCarousel();
    });
    carouselControls.hidden = false;
    carouselToggle.hidden = prefersReducedMotion.matches;
  }
  render();
  languageButton.hidden = false;
  themeButton.hidden = false;
  startCarousel();
})();
