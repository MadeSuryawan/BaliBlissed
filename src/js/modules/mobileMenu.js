import { Utils } from "/js/modules/utils.js";

export const MobileMenu = {
    init() {
        try {
            const menuToggle = Utils.getElement(".menu-toggle");
            const mobileMenu = Utils.getElement(".mobile-menu");
            const overlay = Utils.getElement(".overlay");
            const closeBtn = Utils.getElement(".close-btn");

            if (!menuToggle || !mobileMenu || !overlay || !closeBtn) return;

            menuToggle.addEventListener("click", () => {
                mobileMenu.classList.add("active");
                overlay.classList.add("active");
                document.body.style.overflow = "hidden";
            });

            const closeMenu = () => {
                mobileMenu.classList.remove("active");
                overlay.classList.remove("active");
                document.body.style.overflow = "";
            };

            closeBtn.addEventListener("click", closeMenu);
            overlay.addEventListener("click", closeMenu);
        } catch (error) {
            console.error("Error setting up mobile menu:", error);
        }
    },
};
