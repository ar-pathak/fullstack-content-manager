const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows React frontend to communicate with this API
app.use(express.json()); // Parses incoming JSON requests

// --- HELPER FUNCTIONS ---

// 1. Validate HEX Color
const isValidHex = (color) => {
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    return hexRegex.test(color);
};

// 2. Validate Image URL Accessibility
// We use a HEAD request to check the headers without downloading the whole image
const isImageAccessible = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        
        // Check if the request was successful and if the content is actually an image
        return response.ok && contentType && contentType.startsWith('image/');
    } catch (error) {
        // If fetch throws an error (e.g., DNS resolution fails, invalid URL format)
        return false;
    }
};

// --- ROUTES ---

app.post('/api/content', async (req, res) => {
    const { heading, paragraph, bgImage, color } = req.body;
    let errors = [];

    // 1. Synchronous Validation: Check required fields
    if (!heading || !heading.trim()) errors.push("Heading is required.");
    if (!paragraph || !paragraph.trim()) errors.push("Paragraph content is required.");
    if (!bgImage || !bgImage.trim()) errors.push("Background image URL is required.");
    if (!color || !color.trim()) errors.push("Text color is required.");

    // 2. Synchronous Validation: Check HEX format (only if color was provided)
    if (color && !isValidHex(color)) {
        errors.push("Invalid HEX color format. (e.g., #FFFFFF)");
    }

    // 3. Asynchronous Validation: Check Image Accessibility (only if URL was provided)
    if (bgImage) {
        const isValidImg = await isImageAccessible(bgImage);
        if (!isValidImg) {
            errors.push("Background image URL is invalid, broken, or inaccessible.");
        }
    }

    // 4. Handle Errors
    // If our errors array has anything in it, return a 400 Bad Request
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors
        });
    }

    // 5. Success Response
    return res.status(200).json({
        success: true,
        message: "Content successfully validated and saved.",
        data: {
            heading,
            paragraph,
            bgImage,
            color
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});