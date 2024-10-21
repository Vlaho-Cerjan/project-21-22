import {getSession} from 'next-auth/react';

export default async function IsItAdmin() {
  const session = await getSession();
  if (session?.user.roles) {
    const isAdmin = session.user.roles.some((role) =>
      role.name.toLowerCase().includes('admin'),
    );
    return !!isAdmin;
  }
  return false;
}
