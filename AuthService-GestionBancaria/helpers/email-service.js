import nodemailer from 'nodemailer';
import { config } from '../configs/config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// =========================================
// LOAD CSS
// =========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emailStyles = fs.readFileSync(
  path.join(__dirname, '../styles/emailStyles.css'),
  'utf8'
);

// =========================================
// TRANSPORTER
// =========================================
const createTransporter = () => {
  if (!config.smtp.username || !config.smtp.password) {
    console.warn('SMTP credentials not configured.');
    return null;
  }

  const smtpPort = Number(config.smtp.port) || 587;
  const secure = smtpPort === 465;

  const normalizedPassword = (
    config.smtp.password || ''
  ).replace(/\s+/g, '');

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: smtpPort,
    secure,

    auth: {
      user: config.smtp.username,
      pass: normalizedPassword,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,

    requireTLS: !secure,

    tls: {
      rejectUnauthorized: false,
    },
  });
};

const transporter = createTransporter();

// =========================================
// EMAIL TEMPLATE
// =========================================
const createEmailTemplate = ({
  title,
  subtitle,
  content,
  buttonText,
  buttonUrl,
}) => {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <style>
      ${emailStyles}
    </style>

    <title>${title}</title>
  </head>

  <body>

    <div class="email-wrapper">

      <div class="email-container">

        <!-- HEADER -->
        <div class="email-header">

          <div class="logo">
            KINAL <span>BANC</span>
          </div>

          <div class="logo-line"></div>

        </div>

        <!-- HERO -->
        <div class="email-hero">

          <h1 class="email-title">
            ${title}
          </h1>

          <p class="email-subtitle">
            ${subtitle}
          </p>

        </div>

        <!-- CONTENT -->
        <div class="email-content">

          <div class="content-card">

            <div class="content-text">
              ${content}
            </div>

            ${
              buttonText && buttonUrl
                ? `
                <a
                  href="${buttonUrl}"
                  class="email-button"
                >
                  ${buttonText}
                </a>
              `
                : ''
            }

          </div>

        </div>

        <!-- FOOTER -->
        <div class="email-footer">

          <div class="footer-divider">

            <p class="footer-text">
              Este es un correo automático de Kinal Banc.
              <br/>
              Nunca compartas tus credenciales ni códigos
              de verificación.
            </p>

          </div>

        </div>

      </div>

    </div>

  </body>
  </html>
  `;
};

// =========================================
// VERIFICATION EMAIL
// =========================================
export const sendVerificationEmail = async (
  email,
  name,
  verificationToken
) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const frontendUrl =
      config.app.frontendUrl || 'http://localhost:3000';

    const verificationUrl =
      `${frontendUrl}/auth/verify-email?token=${encodeURIComponent(
        verificationToken
      )}`;

    const html = createEmailTemplate({
      title: 'Verifica tu correo',
      subtitle:
        'Protegemos tu cuenta con verificación segura.',

      content: `
        <p>
          Hola <strong>${name}</strong>,
        </p>

        <p>
          Gracias por registrarte en Kinal Banc.
          Para activar tu cuenta necesitamos
          verificar tu correo electrónico.
        </p>

        <p>
          Presiona el botón de abajo para continuar.
        </p>

        <div class="url-box">
          ${verificationUrl}
        </div>

        <p>
          Este enlace expirará en 24 horas.
        </p>
      `,

      buttonText: 'VERIFICAR CUENTA',
      buttonUrl: verificationUrl,
    });

    await transporter.sendMail({
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Verifica tu cuenta | Kinal Banc',
      html,
    });

    console.log('Verification email sent');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// =========================================
// PASSWORD RESET EMAIL
// =========================================
export const sendPasswordResetEmail = async (
  email,
  name,
  resetToken
) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const frontendUrl =
      config.app.frontendUrl || 'http://localhost:3000';

    const resetUrl =
      `${frontendUrl}/auth/reset-password?token=${encodeURIComponent(
        resetToken
      )}`;

    const html = createEmailTemplate({
      title: 'Restablece tu contraseña',

      subtitle:
        'Recibimos una solicitud para cambiar tus credenciales.',

      content: `
        <p>
          Hola <strong>${name}</strong>,
        </p>

        <p>
          Recibimos una solicitud para
          restablecer tu contraseña.
        </p>

        <p>
          Si realizaste esta acción,
          continúa desde el siguiente botón.
        </p>

        <div class="url-box">
          ${resetUrl}
        </div>

        <p>
          Este enlace expirará en 1 hora.
        </p>
      `,

      buttonText: 'CAMBIAR CONTRASEÑA',
      buttonUrl: resetUrl,
    });

    await transporter.sendMail({
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Restablecimiento de contraseña',
      html,
    });

    console.log('Password reset email sent');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// =========================================
// WELCOME EMAIL
// =========================================
export const sendWelcomeEmail = async (
  email,
  name
) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const html = createEmailTemplate({
      title: 'Bienvenido a Kinal Banc',

      subtitle:
        'Tu cuenta ha sido verificada correctamente.',

      content: `
        <p>
          Hola <strong>${name}</strong>,
        </p>

        <p>
          Tu cuenta ya está activa.
        </p>

        <ul class="feature-list">
          <li>Transferencias seguras</li>
          <li>Control de movimientos</li>
          <li>Gestión de cuentas</li>
          <li>Seguridad avanzada</li>
        </ul>

        <p>
          Gracias por confiar en nosotros.
        </p>
      `,
    });

    await transporter.sendMail({
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Bienvenido a Kinal Banc',
      html,
    });

    console.log('Welcome email sent');
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// =========================================
// PASSWORD CHANGED EMAIL
// =========================================
export const sendPasswordChangedEmail = async (
  email,
  name
) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const html = createEmailTemplate({
      title: 'Contraseña actualizada',

      subtitle:
        'La seguridad de tu cuenta fue actualizada.',

      content: `
        <p>
          Hola <strong>${name}</strong>,
        </p>

        <p>
          Tu contraseña fue modificada exitosamente.
        </p>

        <div class="alert-box">

          <strong>Importante</strong>

          <p>
            Si no reconoces esta actividad,
            cambia tus credenciales inmediatamente.
          </p>

        </div>
      `,
    });

    await transporter.sendMail({
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Contraseña actualizada',
      html,
    });

    console.log('Password changed email sent');
  } catch (error) {
    console.error(error);
    throw error;
  }
};