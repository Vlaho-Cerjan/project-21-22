/* eslint-disable @typescript-eslint/no-unused-expressions */

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type {NextAuthOptions} from 'next-auth';
import {getServerSession} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import {cookies} from 'next/headers';
import apiRequest from './apiRouter';

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
  // https://next-auth.js.org/configuration/providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {label: 'Email', type: 'text'},
        password: {label: 'Password', type: 'password'},
        remember_me: {label: 'Remember Me', type: 'checkbox'},
        token: {label: 'Token', type: 'text'},
      },
      async authorize(credentials) {
        console.log('Entered authorize function', credentials);
        if (credentials && credentials.token) {
          const userRes = await apiRequest({
            uri: 'api/user',
            method: 'GET',
            token: credentials.token,
            auth: true,
          });

          if (!userRes.success) {
            return {
              cause: 'User data could not be retrieved',
            };
          }

          if (typeof userRes === 'object' && 'data' in userRes) {
            return {
              token: credentials.token,
              ...userRes.data,
            };
          }
        }

        cookies().set(
          'rememberMe',
          credentials &&
            credentials.remember_me &&
            credentials.remember_me === 'true'
            ? 'true'
            : 'false',
        );
        const res = await apiRequest({
          uri: 'auth/login',
          method: 'POST',
          data: {
            email: credentials?.email,
            password: credentials?.password,
            remember_me: credentials?.remember_me,
          },
          auth: false,
        });

        if (!res.success) {
          return {
            cause: 'Login failed',
          };
        }

        if (typeof res === 'object' && 'data' in res) {
          const userRes = await apiRequest({
            uri: 'api/user',
            method: 'GET',
            token: res.data.token,
            auth: true,
          });

          if (!userRes.success) {
            return {
              cause: 'User data could not be retrieved',
            };
          }

          if (typeof userRes === 'object' && 'data' in userRes) {
            return {
              token: res.data.token,
              ...userRes.data,
            };
          }
          return null;

          // return res.data;
        }
        // Return null if user data could not be retrieved
        return {
          cause: 'User data could not be retrieved',
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `strategy` should be set to 'jwt' if no database is used.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 3 * 60 * 60, // 3 hours

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: process.env.SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: '/sign-up', // Displays signin buttons
    // signOut: '/auth/signout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    jwt: async ({token, user}) => {
      user && (token.user = user);
      return token;
    },
    session: async ({session, token}) => {
      session.user = token.user;
      return session;
    },
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    // async session({ session, token, user }) { return session },
    // async jwt({ token, user, account, profile, isNewUser }) { return token }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthOptions;

// Use it in server contexts
export function serverAuth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}

export const testExports = {
  authorize: config.providers[0]?.authorize,
};
