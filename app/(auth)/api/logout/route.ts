import type {AxiosResponse} from 'axios';

import apiRequest from '@/src/lib/apiRouter';

export async function POST() {
  const res: AxiosResponse = await apiRequest({
    uri: 'auth/logout',
    method: 'PUT',
    auth: true,
  });

  return Response.json(res);
}
