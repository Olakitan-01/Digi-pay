💳 Digi-Pay API
A robust Digital Wallet and Payment Processing System built for secure financial transactions, wallet management, and real-time payment tracking.

🚀 Core Functionalities
User Onboarding: Secure registration and authentication.

Digital Wallet: Automatic generation of unique account numbers and balance management.

Payment Processing: * Internal Transfers: Seamless peer-to-peer (P2P) wallet transfers.

External Transfers: Simulated processing to external banking institutions.

Wallet Funding: Instant deposit mechanisms.

Security: Multi-layered protection using JWT, Bcrypt password hashing, and mandatory Transaction PINs.

Audit Trail: Complete transaction history with detailed receipts and pagination.

🛠️ Technical Stack
Engine: Node.js / Express.js

Database: MongoDB (Mongoose ODM)

Security: JSON Web Tokens (JWT) & Bcrypt

Architecture: RESTful API (Backend-Only)

⚙️ Quick Start
Installation

Bash

npm install
Environment Setup Create a .env file:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
Launch

Bash

npm start
📂 API Summary
Auth
POST /api/auth/register - Create user & wallet

POST /api/auth/login - Authenticate & get token

POST /api/auth/forgot-password - Forgot password link that will send otp to mail

POST /api/auth/reset-password  - Reset password

Wallet & Payments/ Account
POST /api/account/set-pin - Secure wallet for transactions

POST /api/account/fund - Deposit funds

POST /api/account/transfer - Process internal/external payments

GET /api/account/transactionHistory - Retrieve payment logs

GET /api/account/banks - list all banks

GET /api/account/transaction/:id - Retrieve transaction detail

e.t.c (Check the code for more)

📝 Development Note
This is a backend-only project focused on the logic and security of financial data processing. All responses are served in JSON format.