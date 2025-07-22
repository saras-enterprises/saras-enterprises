const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: '/tmp/' });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  // Parse form-data using multer
  upload.single('attachment')(req, res, async function (err) {
    if (err) {
      res.status(500).json({ success: false, message: 'File upload error' });
      return;
    }

    const { name, email, subject, message } = req.body;
    const file = req.file;

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
      res.status(200).json({ success: true, message: 'Message sent!' });
    } catch (err) {
      if (file) fs.unlinkSync(file.path);
      res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
  });
};