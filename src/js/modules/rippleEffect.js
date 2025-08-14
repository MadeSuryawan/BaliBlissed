import { Utils } from "/js/modules/utils.js";

export const RippleEffect = {
    init() {
        // Apply ripple effect to a wide range of buttons across the site
        const rippleButtons = Utils.getElements(
            ".pagination-arrow, .pagination-number, .carousel-arrow",
        );

        rippleButtons.forEach((button) => {
            button.addEventListener("click", this.createRipple);
        });
    },

    createRipple(event) {
        const button = event.currentTarget;

        // Create the ripple element
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        // Position the ripple at the click location
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${
            event.clientX - button.getBoundingClientRect().left - radius
        }px`;
        circle.style.top = `${
            event.clientY - button.getBoundingClientRect().top - radius
        }px`;
        circle.classList.add("ripple");

        // Remove any existing ripple to prevent clutter
        const existingRipple = button.querySelector(".ripple");
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(circle);

        // Clean up the ripple element after the animation finishes
        setTimeout(() => {
            if (circle.parentElement) {
                circle.remove();
            }
        }, 600);
    },
};
