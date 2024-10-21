// <reference types="next-auth" />
import 'next-auth';
import type {AdapterUser} from 'next-auth/adapters';

export interface CustomUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  mobile_number: string | null;
  roles: {
    id: string;
    name: string;
  }[];
  token: string | null;
  job_title: string | null;
  image: number | null;
  created_at: string;
  updated_at: string;
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  type SessionUser = CustomUser;

  interface Session {
    user: SessionUser;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: User | AdapterUser | CustomUser;
  }
}

declare module 'next-auth/session' {
  interface Session {
    user: CustomUser;
  }
}
