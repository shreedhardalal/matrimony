# Shreedhar's profile

A standalone, static, bilingual profile. This project does not use the parent site's assets or configuration. PostHog loads from its hosted service to capture pageviews; autocapture, session recording, surveys, and feature-flag requests are disabled. The site has no form, backend, or external font request.

## Preview locally

From this directory, run `python3 -m http.server 8000`, then open <http://localhost:8000/>. Stop the server with Ctrl+C. The site can also be opened directly as `index.html`; a local server more closely resembles static hosting.

## Edit the profile and languages

- Edit the English text and profile facts in `index.html`. The HTML is also the no-JavaScript fallback.
- Edit the corresponding Gujarati entries in `translations.js`. Match entries using each element's `data-i18n` or `data-i18n-aria` key. A few translations contain simple HTML such as `<em>`; preserve that markup where appropriate. Edit the Gujarati page title and description there too.
- The “A few details” section contains height, weight, and the full date of birth. Update the English values in `index.html` and matching Gujarati entries in `translations.js`; remove a whole `<div>` in the list to omit a field. The birth date also appears in the hero through the `heroBirth` translation. Keep both languages synchronized and obtain explicit approval before adding or changing personal details.
- Both languages should be updated together. Have a native Gujarati speaker review the translation.
- Family names and photos require family approval before publishing. To omit the family section, remove the entire `<section id="family">` and its navigation link. Also review the family references elsewhere on the page.
- The language and theme buttons save preferences in the visitor's browser where storage is available. The profile remains readable in English without JavaScript.

## Add photos

The hero profile image is `profile-photo.jpg`; update its `src` and matching English/Gujarati alternative text when replacing it. The gallery is a four-photo carousel that advances every five seconds and supports arrow buttons, keyboard controls, and touch scrolling. It pauses while hovered or focused and honors reduced-motion preferences. Put additional approved photos in a local `images/` folder and add a `.carousel-slide` with a `.carousel-image` to `index.html`. For example:

```html
<div class="carousel-image">
  <img src="images/profile.jpg" alt="Shreedhar smiling outdoors" data-i18n-alt="profileAlt">
</div>
```

Use accurate, descriptive alt text and translated captions where included. Update the matching Gujarati alt-text and caption entries in `translations.js`, and keep the slide labels and navigation dots synchronized when changing the slide count. Images default to centered crops; the third and final slides fit the full view. For the hero, keep the existing `portrait-frame photo-placeholder` classes. Do not publish photos without the pictured people's approval.

## Change or remove contact details

The email, phone, and Instagram links are together inside `.contact-links` in `index.html`. Change both the visible text and the link destination, or remove the entire unwanted `<a>` element. Remove the contact section and its header link if no contact method is wanted. These details are public once published; removing a link or hiding content with client-side code does not protect previously published information.

## Publish

Publish the contents of this folder as the root of any static host. For GitHub Pages, place these files in the chosen publishing branch or Pages source directory and enable Pages in the repository settings. Check the resulting URL and all relative assets. If this folder is hosted within an existing site, it can also be served at its own subpath.

Before publishing: obtain approval for any new personal details or photos, review the Gujarati with a native speaker, and confirm the publicly visible contact details. Review all personal information for consent; static hosting makes it public and potentially retainable by others.
