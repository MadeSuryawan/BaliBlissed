import { Utils } from "/js/modules/utils.js";

/**
 * @module ThemeController - Manages the theme (light, dark, system) of the website.
 * - Listens for changes from theme selector dropdowns.
 * - Responds to system theme changes (e.g., OS switching to dark mode).
 * NOTE: The initial theme is now set by an inline script in the <head> of each HTML file to prevent FOUC.
 */
export const ThemeController = {
    _themeSelects: [],
    _systemThemeQuery: window.matchMedia("(prefers-color-scheme: dark)"),

    /**
     * Initializes the theme controller.
     */
    init() {
        this._themeSelects = Utils.getElements(".theme-select");
        if (this._themeSelects.length === 0) {
            return; // Do nothing if no theme selectors are on the page.
        }

        // Sync dropdown with the theme already set by the inline script
        const currentTheme = localStorage.getItem("theme") || "system";
        this._updateAllSelects(currentTheme);

        // Set up listeners for future changes
        this._setupListeners();
    },

    /**
     * Sets up event listeners for theme changes.
     */
    _setupListeners() {
        // Listen for changes on any of the dropdowns
        this._themeSelects.forEach((select) => {
            select.addEventListener("change", (e) => {
                this._setTheme(e.target.value);
            });
        });

        // Listen for changes in the user's OS/browser theme preference
        this._systemThemeQuery.addEventListener("change", () => {
            const currentTheme = localStorage.getItem("theme");
            // If the user has selected "system", re-apply the theme
            if (currentTheme === "system") {
                this._applySystemTheme();
            }
        });
    },

    /**
     * Sets the theme and updates the UI.
     * @param {string} theme - The theme to set ('light', 'dark', or 'system').
     */
    _setTheme(theme) {
        localStorage.setItem("theme", theme);
        this._updateAllSelects(theme);

        if (theme === "system") {
            this._applySystemTheme();
        } else {
            document.documentElement.setAttribute("data-theme", theme);
        }
    },

    /**
     * Applies the current system theme (light or dark) to the document.
     */
    _applySystemTheme() {
        if (this._systemThemeQuery.matches) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
        }
    },

    /**
     * Ensures all theme selector dropdowns show the correct current theme.
     * @param {string} theme - The theme to set the dropdowns to.
     */
    _updateAllSelects(theme) {
        this._themeSelects.forEach((select) => {
            select.value = theme;
        });
    },
};
