/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import nodemailer from 'nodemailer';

export async function sendTestEmail(
  to: string,
  name: string,
  status: string,
  subject: string,
) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'soptokbd.info@gmail.com',
      pass: 'ztngmvrdcaxzxzkb',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const mailOptions = {
      from: '"SoptokBD" <soptokbd.info@gmail.com>',
      to,
      subject,
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9fafb;
        margin: 0;
        padding: 0;
        color: #333;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        padding: 40px;
      }

      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #e9ecef;
      }

      .header h1 {
        font-size: 24px;
        margin: 0;
        color: #2c7be5;
      }

      .content {
        margin-top: 30px;
        font-size: 16px;
        line-height: 1.7;
      }

      .status-badge {
        margin: 20px 0;
        background-color: #e7f1ff;
        color: #2c7be5;
        display: inline-block;
        padding: 8px 8px;
        border-radius: 15px;
        font-weight: bold;
        font-size: 15px;
      }

      .footer {
        margin-top: 40px;
        font-size: 13px;
        color: #6c757d;
        text-align: center;
        border-top: 1px solid #e9ecef;
        padding-top: 20px;
      }

      .footer p {
        margin: 4px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Medicommerce</h1>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>
          We wanted to let you know that the <strong>${subject}</strong>
          has been updated.
        </p>
       Now it is in <p class="status-badge">${status.toUpperCase()}</p> state.
        <p>
          We’ll keep you posted if there are any more updates. If you have any questions, feel free to contact our support team.
        </p>
      </div>
      <div class="footer">
        <p>Best regards,</p>
        <p><strong>SoptokDB Team</strong></p>
        <p>soptokbd.info@gmail.com</p>
      </div>
    </div>
  </body>
</html>
`,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}
