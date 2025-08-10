export const DestHeroImages = {
    init(destinationImages) {
        this.destinationImages = destinationImages;

        this.path = window.location.pathname;
        this.isDestinations = this.path.includes("/destinations/");
        if (!this.isDestinations) return;
        this.isActivityPage =
            this.isDestinations && this.path.includes("/activities");
        this.setImgPath();
    },

    getImgPath() {
        // Get the full document title
        const fullPageTitle = document.title;
        // Extract the core destination name, assuming format "Destination Name | Site Name"
        // Takes the part before the first '|' and trims whitespace
        let coreTitle = fullPageTitle.split("|")[0].trim();
        // Normalize whitespace (replace multiple spaces with single space)
        const cleanedTitle = coreTitle.replace(/\s+/g, " ").trim();
        // Look up the cleaned title in the destinationImages map
        return [cleanedTitle, this.destinationImages[cleanedTitle]];
    },

    setImgPath() {
        ``;
        // Select the hero image element
        const heroImageElement = document.querySelector(
            ".destination-hero .hero-bg"
        );

        // Check if the hero image element exists
        if (!heroImageElement) {
            console.log(
                "Could not find .destination-hero .hero-bg element on this page."
            );
            return;
        }

        const [cleanedTitle, imageUrl] = this.getImgPath();

        if (!imageUrl) {
            const noImgPath = `Image URL not found in destinationImages map for title derived from document.title: ${cleanedTitle} (Original: ${document.title})`;
            console.warn(noImgPath);
            // Optional: Set a default hero image if the lookup fails
            heroImageElement.src = "/images/hero/IMG_7508_DxO.webp";
            heroImageElement.alt = "Bali Blissed";
            return;
        }

        // Determine base path for relative URLs based on current page depth
        let basePath = "";
        // Adjust these paths based on your actual folder structure if needed
        if (this.isActivityPage) {
            basePath = "../../../"; // e.g., from /destinations/activities/activity-name/index.html
        } else if (this.isDestinations) {
            basePath = "../../"; // e.g., from /destinations/region-name/index.html
        }
        // Add more conditions if you have other destination structures

        // Set the src attribute, prepending base path only if imageUrl is relative
        if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
            heroImageElement.src = basePath + imageUrl;
        } else {
            heroImageElement.src = imageUrl; // Use absolute URL as is
        }
        // Optional: Update alt text using the cleaned title
        heroImageElement.alt = cleanedTitle;
    },
};
