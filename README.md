# GreenCart 🌿 — Eco-Friendly E-Commerce Platform

GreenCart is a full-stack MERN e-commerce web application designed to promote sustainable and environmentally responsible shopping. It allows users to browse eco-friendly products, track sustainability impact through **Green Points** and **Eco-Scores**, manage their shopping cart, and empowers administrators to manage inventory through a dedicated control panel.

---

## ✨ Key Features

### 🌱 Sustainability & Green Points System
- **Green Points Rewards:** Customers earn **Green Points** on every purchase of eco-friendly products, incentivizing sustainable shopping habits.
- **Eco-Score Ratings:** Every product displays an **Eco-Score** to help shoppers evaluate its environmental impact before buying.
- **User Sustainability Dashboard:** Track accumulated Green Points and order history directly from the user profile.

### 🛒 Customer Shopping Experience
- **Product Catalog & Filtering:** Browse sustainable products with detailed descriptions, pricing, and Eco-Score indicators.
- **Shopping Cart Management:** Add, update quantities, and remove items seamlessly with real-time price and Green Points calculations.
- **Secure Authentication:** User registration and login protected with JWT (JSON Web Tokens) and encrypted passwords.
- **Responsive Interface:** Mobile-first, clean UI built for smooth navigation across desktops, tablets, and mobile devices.

### 🛠️ Admin Control Panel
- **Product Management (CRUD):** Administrators can add new eco-friendly products, assign Eco-Scores and Green Point values, update product details, and remove items.
- **Protected Routes:** Role-based access control ensuring only authorized admins can access management dashboards.

---

## 💻 Tech Stack
- **Frontend:** React.js, React Router, HTML5, CSS3, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (MongoDB Atlas / Compass)
- **Authentication & Security:** JSON Web Tokens (JWT), bcrypt
- **Version Control:** Git, GitHub

---

## 📁 Project Structure
```text
greencart/
├── client/          # React UI components, pages, custom hooks, and assets
├── server/          # Express server, REST API routes, controllers, and Mongoose models
└── README.md
```
---

## 🚀 Getting Started (Run Locally)

Follow these steps to set up and run the full-stack application on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/lijits/greencart.git
cd greencart
```
### 2. Server (Backend) Setup
```bash
cd server
npm install
```
Create a `.env` file inside the `server` folder and add your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the backend server:
```bash
node server.js
```

### 3. Client (Frontend) Setup
Open a new terminal window, navigate to the `client` folder, and start the React application:
```bash
cd client
npm install
npm run dev
```

---

## 👩‍💻 Developer
**Liji T.S**  
- GitHub: [@lijits](https://github.com/lijits)  
- Email: lijijomijomi@gmail.com
