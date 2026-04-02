# Fullstack Content Manager

A simple fullstack project with:

- A React frontend to manage content using a form and live preview.
- An Express backend API that validates and returns submitted content.

## Features

- Two-column desktop layout:
- Left side: content form
- Right side: preview block
- Mobile-friendly behavior:
- Small screens show one section at a time
- `Show Preview` button opens preview view
- `Back To Form` button returns to form
- Form fields:
- Heading (text)
- Paragraph (rich text editor)
- Background Image URL
- Text Color (HEX)
- Client-side validation:
- Required fields
- HEX color format
- Paragraph must contain readable content
- Server-side validation:
- Required fields
- HEX color format
- URL format (`http/https`)
- Background image accessibility and MIME type check
- Structured success and error API responses

## Project Structure

```text
fullstack-content-manager/
  backend/
    server.js
    package.json
  frontend/
    src/
      App.jsx
      App.css
      components/ContentForm.jsx
    package.json
```

## Prerequisites

- Node.js 18+ recommended
- npm

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

Create env files from examples:

- `backend/.env`
- `frontend/.env`

Backend env values:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Frontend env values:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Run The App

Start backend (port `5000`):

```bash
cd backend
npm run dev
```

Start frontend (Vite default port `5173`):

```bash
cd frontend
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## API

### `POST /api/content`

Validates submitted content and returns either errors or validated data.

Request body:

```json
{
  "heading": "Your heading",
  "paragraph": "<p>Rich text paragraph</p>",
  "bgImage": "https://example.com/image.jpg",
  "color": "#ffffff"
}
```

Success response (`200`):

```json
{
  "success": true,
  "message": "Content successfully validated and saved.",
  "data": {
    "heading": "Your heading",
    "paragraph": "<p>Rich text paragraph</p>",
    "bgImage": "https://example.com/image.jpg",
    "color": "#ffffff"
  }
}
```

Validation error response (`400`):

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Invalid HEX color format. (e.g., #FFFFFF)",
    "Background image URL is broken or inaccessible."
  ]
}
```

## Frontend Behavior

- On successful submission:
- Backend returns validated data
- Preview section updates dynamically
- Form resets for next entry
- On invalid submission:
- Field-level client errors are shown
- Server validation errors are shown in a clear error list

## Build

Frontend production build:

```bash
cd frontend
npm run build
```

## Notes

- The rich text editor package used is `react-quill-new` (React 19 compatible).
- If image URLs are blocked by remote server policies, backend may return an accessibility error.
