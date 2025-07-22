require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// Optional: Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','index.html'));
});
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.post('/api/contact', upload.single('attachment'), async (req, res) => {
  const { name, email, subject, message } = req.body;
  const file = req.file;

  console.log('Received file:', file); // Debug log for attachment

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    to: process.env.DEST_EMAIL,
    subject: `New Contact Form Submission | ${subject}`,
    text: message,
    replyTo: email,
    attachments: file
      ? [
          {
            filename: file.originalname,
            path: file.path,
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    if (file) fs.unlinkSync(file.path);
    res.json({ success: true, message: 'Message sent!' });
  } catch (err) {
    if (file) fs.unlinkSync(file.path);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 