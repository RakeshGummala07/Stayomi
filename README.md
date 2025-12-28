# Stayomi

A modern hotel‑booking / accommodation management web application built with Node.js, Express, EJS, and MongoDB.

## ✨ Features

- CRUD operations for hotels, rooms and bookings  
- User authentication and role‑based access (e.g., admin vs guest)  
- Dynamic EJS templates for server‑rendered views  
- Schema validation of request data for robustness (`schemaValidation.js`)  
- Cloud configuration support (see `cloudConfig.js`)  
- Organized MVC‑style folder structure: `controllers/`, `models/`, `routes/`, `views/`  
- Static public assets (CSS/JS/images) served from `public/`  
- Utilities encapsulated in `utils/` for helper functions and reusable logic  
- Middleware for request handling and error checking (`middleware.js`)  

## 🛠️ Tech Stack

- **Backend:** Node.js + Express  
- **Templating:** EJS (Embedded JavaScript Templates)  
- **Database:** MongoDB (or any MongoDB‑compatible cloud service)  
- **Validation:** Custom schema validation via `schemaValidation.js`  
- **Static files & assets:** CSS, JS, images in `public/`  
- **Project structure:** Well‑organized into folders (`controllers/`, `models/`, `routes/`, `views/`, `utils/`)  
- **Configuration:** `cloudConfig.js` handles connection strings, environment settings  

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+ recommended)  
- npm (or yarn)  
- MongoDB instance (local or cloud)  

### Installation

```bash
# Clone the repository
git clone https://github.com/RakeshGummala07/Stayomi.git
cd Stayomi

# Install dependencies
npm install
