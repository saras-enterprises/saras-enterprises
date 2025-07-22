# Backend Contact Form API

## Setup

1. Copy `.env.example` to `.env` and fill in your SMTP credentials and destination email.
2. Install dependencies:
   ```sh
   npm install express nodemailer multer dotenv
   ```
3. Start the server:
   ```sh
   node server.js
   ```

## Endpoint

POST `/api/contact`
- Fields: `name`, `email`, `message`, `attachment` (file)
- Sends email to the address in `DEST_EMAIL` with the message and optional attachment. 