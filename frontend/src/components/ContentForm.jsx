import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export default function ContentForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        heading: '',
        paragraph: '',
        bgImage: '',
        color: '#ffffff'
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState([]);

    const hasReadableText = (html = '') => {
        const textOnly = html
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .trim();
        return textOnly.length > 0;
    };

    // Client-side Validation
    const validateForm = () => {
        const newErrors = {};
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;

        if (!formData.heading.trim()) newErrors.heading = 'Heading is required.';
        if (!formData.paragraph.trim() || !hasReadableText(formData.paragraph)) {
            newErrors.paragraph = 'Paragraph is required.';
        }
        if (!formData.bgImage.trim()) newErrors.bgImage = 'Background image URL is required.';
        if (!hexRegex.test(formData.color)) newErrors.color = 'Must be a valid HEX color.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerErrors([]);

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Clear form and trigger the UI update in the parent component
                setFormData({ heading: '', paragraph: '', bgImage: '', color: '#ffffff' });
                onSuccess(data.data);
            } else {
                // Backend validation failed (e.g., broken image URL)
                setServerErrors(data.errors || ['An error occurred processing your request.']);
            }
        } catch (error) {
            setServerErrors(['Failed to connect to the server. Is the backend running?']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <h2>Content Manager</h2>

            {serverErrors.length > 0 && (
                <div className="server-error">
                    <ul>{serverErrors.map((err, i) => <li key={i}>{err}</li>)}</ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Heading</label>
                    <input
                        type="text"
                        className="text-input"
                        value={formData.heading}
                        onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    />
                    {errors.heading && <span className="error-text">{errors.heading}</span>}
                </div>

                <div className="form-group">
                    <label>Paragraph</label>
                    <ReactQuill
                        theme="snow"
                        value={formData.paragraph}
                        onChange={(content) => setFormData({ ...formData, paragraph: content })}
                    />
                    {errors.paragraph && <span className="error-text">{errors.paragraph}</span>}
                </div>

                <div className="form-group">
                    <label>Background Image (URL)</label>
                    <input
                        type="url"
                        className="text-input"
                        placeholder="https://example.com/image.jpg"
                        value={formData.bgImage}
                        onChange={(e) => setFormData({ ...formData, bgImage: e.target.value })}
                    />
                    {errors.bgImage && <span className="error-text">{errors.bgImage}</span>}
                </div>

                <div className="form-group">
                    <label>Text Color (HEX)</label>
                    <div className="color-input-row">
                        <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                        <input
                            type="text"
                            className="text-input"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                    </div>
                    {errors.color && <span className="error-text">{errors.color}</span>}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Validating & Saving...' : 'Update Preview'}
                </button>
            </form>
        </div>
    );
}
