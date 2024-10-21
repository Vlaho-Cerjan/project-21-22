import {signOut} from 'next-auth/react';

export async function RefreshIfLoggedOut(err: string) {
  if (err === 'invalid_user_token' || err === 'unauthorized') {
    await signOut();
  }
}
