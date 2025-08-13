export const MapController = {
    init(mapUrls) {
        this.mapUrls = mapUrls;
        this.setupMap();
    },

    getMapUrl(locationName) {
        let addressLocation = `${locationName}, Bali, Indonesia`;
        if (locationName === "Ijen Volcano") {
            addressLocation = `${locationName}, East Java, Indonesia`;
        }
        const encodedAddress = encodeURIComponent(addressLocation);
        const template = this.mapUrls[locationName] || this.mapUrls["default"];
        return `${template[0]}${encodedAddress}${template[1]}`;
    },

    setupMap() {
        try {
            // Check if map is already initialized by page-specific script
            if (window.mapInitialized) return;

            // Find location elements on the page
            const locationElement = document.querySelector(
                "#destination-location",
            );
            if (!locationElement) return; // Exit if not on a page with location element

            const mapModal = document.querySelector("#map-modal");
            const mapClose = document.querySelector("#map-close");
            const mapIframe = document.querySelector("#map-iframe");

            if (!mapModal || !mapClose || !mapIframe) return;

            // Get the location text from the address span
            const addressSpan = locationElement.querySelector("span");
            if (!addressSpan) return;

            // Open map modal when location is clicked
            locationElement.addEventListener("click", () => {
                // Set the iframe source
                mapIframe.src = this.getMapUrl(addressSpan.textContent.trim());

                // Show the modal
                mapModal.classList.add("active");

                // Prevent scrolling on the body when modal is open
                document.body.style.overflow = "hidden";
            });

            // Close map modal when close button is clicked
            mapClose.addEventListener("click", () => {
                mapModal.classList.remove("active");

                // Re-enable scrolling on the body
                document.body.style.overflow = "";

                // Clear the iframe source to stop it from running in the background
                setTimeout(() => {
                    mapIframe.src = "";
                }, 300);
            });

            // Close map modal when clicking outside the map container
            mapModal.addEventListener("click", (e) => {
                if (e.target === mapModal) {
                    mapClose.click();
                }
            });

            // Close map modal when ESC key is pressed
            document.addEventListener("keydown", (e) => {
                if (
                    e.key === "Escape" &&
                    mapModal.classList.contains("active")
                ) {
                    mapClose.click();
                }
            });
        } catch (error) {
            console.error("Error initializing map functionality:", error);
        }
    },
};
