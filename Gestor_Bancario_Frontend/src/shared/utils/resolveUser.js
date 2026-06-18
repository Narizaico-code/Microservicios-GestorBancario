// Normaliza los distintos shapes de usuario que devuelve el AuthService
// (camelCase / PascalCase / records anidados) a un objeto plano estable.
export const resolveUser = (user) => {
  const profile = user?.UserProfile || {}
  const emailRecord = user?.UserEmail || {}
  const roleRecord = user?.UserRoles?.[0]?.Role || {}

  return {
    id: user?.id || user?.Id || '',
    name: user?.name || user?.Name || 'Sin nombre',
    email: user?.email || user?.Email || 'sin-email',
    phone: user?.phone || profile.phone || profile.Phone || '',
    role: user?.role || roleRecord.Name || 'USER_ROLE',
    isActive: user?.isActive ?? user?.IsActive ?? false,
    emailVerified: user?.isEmailVerified ?? emailRecord.EmailVerified ?? false,
    dpi: profile.DPI || profile.dpi || 'No registrado',
    address: profile.Address || profile.address || 'No registrada',
    monthlyIncome: profile.MonthlyIncome || profile.monthlyIncome || 0,
    occupation: profile.Occupation || profile.occupation || 'No registrada',
    createdAt: user?.createdAt || user?.CreatedAt,
  }
}
