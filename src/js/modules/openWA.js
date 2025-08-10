import { CONFIG } from "/js/modules/config.js";

export function openWhatsApp(customMessage = null) {
    try {
        // If a custom message is provided, use it; otherwise use the default
        const message = customMessage || CONFIG.WHATSAPP_DEFAULT_MESSAGE;
        const whatsappURL = `https://wa.me/${
            CONFIG.WHATSAPP_NUMBER
        }?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    } catch (error) {
        console.error("Failed to open WhatsApp chat:", error);
        // Could add fallback behavior here
    }
}
