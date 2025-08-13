# AI Development Rules for BaliBlissed

This document outlines the technical stack and development guidelines for the BaliBlissed web application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## 1. Tech Stack Overview

The BaliBlissed application is built using a modern web development stack, prioritizing component-based architecture, type safety, and utility-first styling.

- **Frontend Framework:** React.js (for building interactive user interfaces)
- **Language:** TypeScript (for enhanced code quality, type safety, and better developer experience)
- **Styling:** Tailwind CSS (a utility-first CSS framework for rapid and consistent styling)
- **UI Components:** shadcn/ui (pre-built, customizable UI components based on Radix UI and Tailwind CSS)
- **Routing:** React Router (for declarative client-side routing)
- **Icons:** Lucide React (for a consistent and customizable icon set within React components)
- **Build Tool:** Gulp (for automating development tasks like minification and asset compilation)
- **Package Manager:** npm (for managing project dependencies)
- **Notifications:** react-hot-toast (for simple and elegant toast notifications)

## 2. Library Usage Rules

To maintain a clean, efficient, and scalable codebase, please adhere to the following rules regarding library usage:

- **React Components:** All new UI elements and pages **must** be developed as React components. Break down complex features into smaller, reusable components.
- **TypeScript First:** All new JavaScript files for React components (`.tsx`) and utility functions (`.ts`) **must** be written in TypeScript. Leverage types and interfaces for all props, state, and function parameters.
- **Tailwind CSS for Styling:**
    - **Exclusive Use:** All styling for new components and modifications to existing ones **must** use Tailwind CSS utility classes.
    - **Avoid Custom CSS:** Minimize the introduction of new custom CSS rules in `src/css/style.css`. If a style can be achieved with Tailwind, use Tailwind.
    - **Responsive Design:** Always consider responsiveness using Tailwind's responsive prefixes (e.g., `sm:`, `md:`, `lg:`) to ensure the application looks good on all devices.
- **shadcn/ui Components:**
    - **Prioritize:** Before creating a custom component, check if a suitable component exists within the `shadcn/ui` library.
    - **No Modification:** **Do not modify the source files of `shadcn/ui` components directly.** If a `shadcn/ui` component needs customization beyond its props, create a new component that wraps or extends it.
- **React Router for Navigation:** All internal application navigation **must** be handled by React Router. Define routes clearly in `src/App.tsx`.
- **Icon Library:** For all new icons within React components, use `lucide-react`. While Font Awesome is currently present in some HTML files, `lucide-react` is the preferred choice for the React environment.
- **State Management:** For component-level state, use React's built-in `useState` and `useReducer` hooks. For global or shared state, `useContext` should be the primary approach unless a more complex state management solution is explicitly requested.
- **API Calls:** Use the native `fetch` API for making HTTP requests. Avoid introducing heavy third-party HTTP client libraries unless a specific need arises.
- **Toasts/Notifications:** For user feedback messages (e.g., success, error, loading), use `react-hot-toast`.
- **File Structure:** Maintain the established directory structure:
    - `src/pages/`: For top-level views/pages.
    - `src/components/`: For reusable UI components.
    - `src/utils/`: For utility functions and helpers.
    - `src/App.tsx`: For main application setup and routing.
- **Code Quality:**
    - Write clean, readable, and well-commented code.
    - Follow consistent naming conventions (e.g., PascalCase for components, camelCase for variables/functions).
    - Ensure all imports are resolved and correctly point to existing files or installed packages.
    - Prioritize small, focused files and components (ideally under 100 lines of code per component).
