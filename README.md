# DOCUMENT_EDITOR


COMPANY: CODTECH IT SOLUTIONS

NAME: Thakur Aditya Vithalrao

INTERN ID: CTIS1924

DOMAIN: Full Stack Web Development

DURATION: 6 Weeks

MENTOR: NEELA SANTOSH


📝 CollabEdit - Custom Minimalist Edition
A streamlined, real-time collaborative document editor. This version has been refactored to move away from heavy CSS frameworks in favor of Pure Standard CSS, offering a "Glassmorphism" aesthetic with high performance.

✨ Features
🎨 Pure CSS Design (No Tailwind)
Custom Glassmorphism: High-end translucent UI panels using native CSS backdrop-filter.

Vanilla Layouts: Modern layouts built using CSS Flexbox and Grid for maximum browser compatibility.

Deep Space Theme: A premium dark-mode aesthetic using radial gradients.

Zero Framework Bloat: Faster load times by eliminating the need for large CSS utility libraries.

📄 Document Management
Live Document Grid: View your saved work in a sleek, responsive card layout.

Instant Collaboration: Powered by Socket.io—type in one window and see it in another instantly.

Monaco Engine: Uses the industry-standard Monaco Editor (the same engine behind VS Code) for text editing.

Auto-Sync: Changes are persisted to MongoDB as you type.

🛠️ Updated Tech Stack
Frontend
React 18: Component-based UI architecture.

Standard CSS: Custom-built stylesheet (index.css) for all visual styling.

Framer Motion: Smooth entry/exit animations for page transitions.

React Router: Seamless navigation between the document list and editor.

Backend
Node.js & Express: Handling API requests and document routing.

Socket.io: Managing the real-time websocket connections between users.

MongoDB & Mongoose: Secure data storage for your documents.

🚀 Getting Started
1. Installation
Bash
# Clone the repository
git clone <your-repo-url>
cd COLLABORATIVE-DOCUMENT

# Install dependencies for both parts
    cd server && npm install
    cd ../client && npm install
2. Environment Setup
Create a .env file in the server directory:

Code snippet
    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
3. Running the App
Open two terminals in VS Code:

    Terminal 1 (Server): cd server && npm start
    
    Terminal 2 (Client): cd client && npm start

🎨 Customizing the UI
Since this project now uses Standard CSS, you can easily change the look without learning Tailwind classes:

Colors: Open client/src/index.css and modify the :root variables at the top.

Layout: Edit the .doc-grid class in index.css to change how many documents appear per row.

Editor Style: The Monaco Editor settings can be adjusted directly in DocumentEditor.jsx.


Output: -

<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/6d18e660-8be9-4b8e-8ec9-51ccaace7453" />
<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/e06fe8f3-ff9f-4998-8bd9-a407800180f3" />
<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/53270f4c-dbc0-4942-8dfd-0255a020c115" />
<img width="1919" height="1079" alt="Image" src="https://github.com/user-attachments/assets/992f17f9-f2da-4b15-83d5-cabe63e8d4a5" />
