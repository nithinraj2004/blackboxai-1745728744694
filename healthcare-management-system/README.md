# Healthcare Management System

This is a simple healthcare management system web application where doctors can enter patient data, patients can view their health data, and share their encrypted health data with other hospitals.

## Features

- Doctor login and dashboard to enter patient health data.
- Patient login and dashboard to view and share encrypted health data.
- Data encryption for secure storage and sharing.
- Simple authentication using username and password headers (for demo purposes).

## Technologies Used

- Backend: Node.js, Express, Crypto module for encryption.
- Frontend: HTML, Tailwind CSS, JavaScript.
- No database used; data is stored in-memory for demonstration.

## Setup and Run

1. Install Node.js if not already installed.

2. Navigate to the project directory:

```bash
cd healthcare-management-system
```

3. Install dependencies:

```bash
npm install express body-parser
```

4. Start the backend server:

```bash
node server.js
```

5. Open the frontend files in a browser:

- `frontend/index.html` for login.
- After login, you will be redirected to the appropriate dashboard.

## Notes

- This is a demo application and not production-ready.
- Authentication and data storage are simplified.
- Encryption key is generated on server start and not persisted.
- For real-world use, implement secure authentication, persistent encrypted storage, and secure key management.
