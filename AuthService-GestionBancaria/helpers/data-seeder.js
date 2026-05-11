import { Role } from '../src/auth/role.model.js';
import { User, UserProfile, UserEmail } from '../src/users/user.model.js';
import { UserRole } from '../src/auth/role.model.js';
import { USER_ROLE, ADMIN_ROLE } from './role-constants.js';
import { generateUserId } from './uuid-generator.js';
import { hashPassword } from '../utils/password-utils.js';

export const seedData = async () => {
  // Crear roles si no existen
  const roles = [ADMIN_ROLE, USER_ROLE];
  for (const name of roles) {
    await Role.findOrCreate({
      where: { Name: name },
      defaults: { Id: generateUserId(), Name: name },
    });
  }

  const adminEmail = 'adminb@gestor.local';
  const existingAdmin = await User.findOne({ where: { Email: adminEmail } });
  if (!existingAdmin) {
    const adminRole = await Role.findOne({ where: { Name: ADMIN_ROLE } });
    if (adminRole) {
      const userId = generateUserId();
      const profileId = generateUserId();
      const emailId = generateUserId();
      const userRoleId = generateUserId();
      const password = await hashPassword('ADMINB');

      await User.create({
        Id: userId,
        Name: 'Admin',
        Email: adminEmail,
        Password: password,
        IsActive: true,
      });

      await UserProfile.create({
        Id: profileId,
        UserId: userId,
        Imagen: '',
        Phone: '39539423',
      });

      await UserEmail.create({
        Id: emailId,
        UserId: userId,
        EmailVerified: true,
        EmailVerificationToken: null,
        EmailVerificationTokenExpiry: null,
      });

      await UserRole.create({
        Id: userRoleId,
        UserId: userId,
        RoleId: adminRole.Id,
      });
    }
  }
};
