// server.js  (ESM)  (or .js if "type":"module" is set)

import process from "node:process";
import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import "dotenv/config"; // <-- ESM-friendly: auto-loads .env

const app = express();
const PORT = 4000;

// Graceful shutdown on uncaught errors
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

/* ---------- Middleware ---------- */
app.use(cors());
app.use(bodyParser.json());

/* ---------- Route ---------- */
app.post("/send-contact", async (req, res) => {
    const { name, email, message, phone, travelers, service, dates } = req.body;

    if (!name || !email || !message) {
        return res
            .status(400)
            .json({ message: "Name, email, and message are required." });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"${name} via BaliBlissed" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: "New Email from BaliBlissed",
        text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        Travelers: ${travelers || "Not specified"}
        Service Interest: ${service || "Not specified"}
        Travel Dates: ${dates || "Flexible"}
        Message: ${message}
        `.trim(),
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            message: "Thank you! Your email has been sent.",
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            message: "Failed to send email.",
            error: error.toString(),
        });
    }
});

/* ---------- Start server ---------- */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
