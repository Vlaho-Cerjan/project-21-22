import {config} from '@/src/lib/auth';
import NextAuth from 'next-auth';
import {cookies} from 'next/headers';

// For more information on each option (and a full list of options) go to
const handler = async (req: any, res: any) => {
  const cookieStore = cookies();
  const rememberMe = cookieStore.get('rememberMe');

  return await NextAuth(req, res, {
    // Other options go here 👈🏽
    ...config,
    session: {
      // @ts-expect-error - Property 'jwt' does not exist on type 'SessionOptions'.
      jwt: true,
      maxAge:
        rememberMe && rememberMe.value === 'true'
          ? 31 * 24 * 60 * 60
          : 25 * 60 * 60,
    },
  });
};

export {handler as GET, handler as POST};
