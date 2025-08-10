import { Utils } from "/js/modules/utils.js";

export const PaginationController = {
    currentPage: 1,
    isInitialLoad: true,

    init() {
        try {
            const prevButton = Utils.getElement(".prev-page");
            const nextButton = Utils.getElement(".next-page");
            const paginationNumbersContainer = Utils.getElement(
                ".pagination-numbers"
            );
            const destinationPages = Utils.getElements(".destinations-page");

            if (
                !prevButton ||
                !nextButton ||
                !paginationNumbersContainer ||
                destinationPages.length === 0
            ) {
                return; // Exit if elements don't exist
            }

            this.prevButton = prevButton;
            this.nextButton = nextButton;
            this.paginationNumbersContainer = paginationNumbersContainer;
            this.destinationPages = destinationPages;
            this.destinationsSection = Utils.getElement("#destinations");
            this.totalPages = destinationPages.length;
            this.maxVisibleButtons = 3;

            // Set up event delegation for pagination numbers
            this.paginationNumbersContainer.addEventListener("click", (e) => {
                if (e.target.classList.contains("pagination-number")) {
                    const pageNumber = parseInt(
                        e.target.getAttribute("data-page")
                    );
                    if (!isNaN(pageNumber)) {
                        this.showPage(pageNumber, true);
                    }
                }
            });

            // Add click event listeners to prev/next buttons
            this.prevButton.addEventListener("click", () => {
                if (this.currentPage > 1) {
                    this.showPage(this.currentPage - 1, true);
                }
            });

            this.nextButton.addEventListener("click", () => {
                if (this.currentPage < this.totalPages) {
                    this.showPage(this.currentPage + 1, true);
                }
            });

            // Initialize pagination - don't scroll on initial load
            setTimeout(() => {
                this.showPage(1, false);
            }, 150);
        } catch (error) {
            console.error("Error initializing pagination:", error);
        }
    },

    showPage(pageNumber, userInitiated = false) {
        try {
            // Hide all pages
            this.destinationPages.forEach((page) => {
                page.classList.remove("active");
            });

            // Show the selected page
            const pageToShow = Utils.getElement(
                `.destinations-page[data-page="${pageNumber}"]`
            );
            if (pageToShow) {
                pageToShow.classList.add("active");
            }

            // Update current page
            this.currentPage = pageNumber;

            // Update pagination UI
            this.updatePaginationUI();

            // Only scroll if this was triggered by a user action (button click)
            // and we're on mobile
            if (
                userInitiated &&
                this.destinationsSection &&
                Utils.isMobileDevice()
            ) {
                this.destinationsSection.scrollIntoView({
                    behavior: "smooth",
                });
            }

            // After first call, it's no longer the initial load
            this.isInitialLoad = false;
        } catch (error) {
            console.error("Error showing page:", error);
        }
    },

    updatePaginationUI() {
        try {
            // Clear existing buttons
            this.paginationNumbersContainer.innerHTML = "";

            // Calculate which buttons to show
            let startPage = Math.max(
                1,
                this.currentPage - Math.floor(this.maxVisibleButtons / 2)
            );
            let endPage = startPage + this.maxVisibleButtons - 1;

            // Adjust if we're near the end
            if (endPage > this.totalPages) {
                endPage = this.totalPages;
                startPage = Math.max(1, endPage - this.maxVisibleButtons + 1);
            }

            // Create the buttons
            for (let i = startPage; i <= endPage; i++) {
                const button = document.createElement("button");
                button.classList.add("pagination-number");
                button.setAttribute("data-page", i);
                button.textContent = i;

                if (i === this.currentPage) {
                    button.classList.add("active");
                }

                this.paginationNumbersContainer.appendChild(button);
            }

            // Update prev/next button states
            if (this.currentPage === 1) {
                this.prevButton.setAttribute("disabled", "disabled");
                this.prevButton.classList.add("disabled");
            } else {
                this.prevButton.removeAttribute("disabled");
                this.prevButton.classList.remove("disabled");
            }

            if (this.currentPage === this.totalPages) {
                this.nextButton.setAttribute("disabled", "disabled");
                this.nextButton.classList.add("disabled");
            } else {
                this.nextButton.removeAttribute("disabled");
                this.nextButton.classList.remove("disabled");
            }
        } catch (error) {
            console.error("Error updating pagination UI:", error);
        }
    },
};
