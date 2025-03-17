import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const port = 8000;

app.use(cors({
  origin: 'http://localhost:5173' // Vite's default development server
}));
app.use(express.json());

// Create a test email account using Ethereal
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'marvin.stoltenberg73@ethereal.email',
    pass: 'tYVPjkYtF5FZm4Yv3q'
  }
});

app.post('/api/send-for-signature', async (req, res) => {
  try {
    const { templateId, documentId, recipient, documentName } = req.body;
    
    if (!templateId || !documentId || !recipient || !documentName) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Send email to recipient
    const mailOptions = {
      from: '"DeloitteSign" <no-reply@deloittesign.com>',
      to: recipient,
      subject: 'Document Ready for Signature',
      html: `
        <h2>Document Ready for Signature</h2>
        <p>Hello,</p>
        <p>A document is ready for your signature:</p>
        <ul>
          <li><strong>Document:</strong> ${documentName}</li>
          <li><strong>Document ID:</strong> ${documentId}</li>
        </ul>
        <p>Please sign the document at your earliest convenience.</p>
        <p>Best regards,<br>DeloitteSign Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    // Preview URL for development (Ethereal)
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

    res.json({
      status: 'success',
      message: `Email sent successfully to ${recipient}`,
      templateId,
      documentId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send email'
    });
  }
});