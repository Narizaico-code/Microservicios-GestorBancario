import { SignupRequest } from '../src/auth/signup-request.model.js';
import { checkUserExists } from './user-db.js';
import { hashPassword } from '../utils/password-utils.js';
import { generateEmailVerificationToken } from '../utils/auth-helpers.js';
import { sendVerificationEmail } from './email-service.js';
import { Op } from 'sequelize';

export const createSignupRequest = async ({
  name,
  email,
  password,
  phone,
  profilePicture,
}) => {
  const normalizedEmail = email.toLowerCase();

  if (await checkUserExists(normalizedEmail)) {
    const err = new Error('Ya existe un usuario con este email');
    err.status = 409;
    throw err;
  }

  const existingPending = await SignupRequest.findOne({
    where: { Email: normalizedEmail, Status: 'PENDING' },
  });
  if (existingPending) {
    const err = new Error('Ya existe una solicitud pendiente para este email');
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(password);

  // If there is an existing signup request for this email that was rejected,
  // allow reusing it by updating its data and marking it as PENDING again.
  const existingAny = await SignupRequest.findOne({ where: { Email: normalizedEmail } });
  if (existingAny) {
    if (existingAny.Status === 'REJECTED') {
      existingAny.Name = name
      existingAny.PasswordHash = passwordHash
      existingAny.Phone = phone
      existingAny.ProfilePicture = profilePicture || null
      existingAny.Status = 'PENDING'
      existingAny.ApprovedBy = null
      existingAny.ApprovedAt = null
      existingAny.VerificationToken = null
      existingAny.VerificationTokenExpiry = null
      await existingAny.save()
      return existingAny
    }
    // If it's APPROVED or other state, creation will fail due to unique constraint
    // but we intentionally fall through to throw a friendly error instead of
    // hitting a DB unique constraint exception.
    const err = new Error('Ya existe una solicitud para este email')
    err.status = 409
    throw err
  }

  const request = await SignupRequest.create({
    Name: name,
    Email: normalizedEmail,
    PasswordHash: passwordHash,
    Phone: phone,
    ProfilePicture: profilePicture || null,
    Status: 'PENDING',
  });

  return request;
};

export const listSignupRequests = async ({ status = 'PENDING' } = {}) => {
  const whereClause = status ? { Status: status } : {};
  return SignupRequest.findAll({
    where: whereClause,
    order: [['created_at', 'ASC']],
    attributes: { exclude: ['PasswordHash'] },
  });
};

export const getSignupRequestById = async (id) => {
  return SignupRequest.findByPk(id);
};

export const approveSignupRequest = async (id, approverId) => {
  const request = await SignupRequest.findByPk(id);
  if (!request) {
    const err = new Error('Solicitud no encontrada');
    err.status = 404;
    throw err;
  }

  if (request.Status !== 'PENDING') {
    const err = new Error('La solicitud ya fue procesada');
    err.status = 400;
    throw err;
  }

  if (await checkUserExists(request.Email)) {
    const err = new Error('Ya existe un usuario con este email');
    err.status = 409;
    throw err;
  }

  // Generar token de verificación sobre la solicitud aprobada.
  const verificationToken = await generateEmailVerificationToken();
  const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Marcar la solicitud como aprobada
  request.Status = 'APPROVED';
  request.ApprovedBy = approverId || null;
  request.ApprovedAt = new Date();
  request.VerificationToken = verificationToken;
  request.VerificationTokenExpiry = tokenExpiry;
  await request.save();

  // Enviar email con el token de verificación
  try {
    await sendVerificationEmail(request.Email, request.Name, verificationToken);
  } catch (err) {
    // No romper el flujo si el correo falla; el token sigue siendo válido
    console.error(
      'Error enviando email de verificación tras aprobar solicitud:',
      err
    );
  }

  return { request, verificationToken };
};

export const findApprovedSignupRequestByVerificationToken = async (token) => {
  return SignupRequest.findOne({
    where: {
      Status: 'APPROVED',
      VerificationToken: token,
      VerificationTokenExpiry: {
        [Op.gt]: new Date(),
      },
    },
  });
};

export const consumeSignupRequestVerificationToken = async (requestId) => {
  await SignupRequest.update(
    {
      VerificationToken: null,
      VerificationTokenExpiry: null,
    },
    {
      where: { Id: requestId },
    }
  );
};

export const rejectSignupRequest = async (id, approverId) => {
  const request = await SignupRequest.findByPk(id);
  if (!request) {
    const err = new Error('Solicitud no encontrada');
    err.status = 404;
    throw err;
  }

  if (request.Status !== 'PENDING') {
    const err = new Error('La solicitud ya fue procesada');
    err.status = 400;
    throw err;
  }

  request.Status = 'REJECTED';
  request.ApprovedBy = approverId || null;
  request.ApprovedAt = new Date();
  await request.save();
  return request;
};
