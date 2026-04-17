require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── Nodemailer transporter ───────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Contact form endpoint ────────────────────────────────────────
app.post('/send', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `Portfolio Contact: ${subject}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f5f5f5;border-radius:12px;">
        <h2 style="margin:0 0 4px;color:#09090b;font-size:1.25rem;">New message from your portfolio</h2>
        <p style="margin:0 0 24px;color:#71717a;font-size:.875rem;">Someone reached out via erylclifford.com</p>
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06);">
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:.8125rem;width:90px;">Name</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e4e4e7;color:#09090b;font-weight:500;">${name}</td>
          </tr>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:.8125rem;">Email</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e4e4e7;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #e4e4e7;color:#71717a;font-size:.8125rem;">Subject</td>
            <td style="padding:14px 18px;border-bottom:1px solid #e4e4e7;color:#09090b;">${subject}</td>
          </tr>
          <tr>
            <td style="padding:14px 18px;color:#71717a;font-size:.8125rem;vertical-align:top;">Message</td>
            <td style="padding:14px 18px;color:#09090b;line-height:1.6;white-space:pre-wrap;">${message}</td>
          </tr>
        </table>
        <p style="margin:20px 0 0;color:#a1a1aa;font-size:.75rem;text-align:center;">Sent from erylclifford.com portfolio contact form</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
