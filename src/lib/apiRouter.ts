import type {Method} from 'axios';
import axios from 'axios';

import {serverAuth} from './auth';

interface ApiReqProps {
  uri: string;
  method?: Method;
  data?: any;
  auth?: boolean;
  token?: string;
  additionalHeaders?: object;
  abort?: AbortController;
}

const apiRequest = async function ({
  uri,
  method = 'GET',
  data,
  auth = false,
  token,
  additionalHeaders,
  abort,
}: ApiReqProps) {
  const session: any = await serverAuth();

  if (!token && (!session || !session.user.token)) {
    auth = false;
  }

  const abortController = abort ?? new AbortController();

  let headers: any = {
    Authorization: `Bearer ${token || session?.user.token}`,
    // 'Content-Type': 'application/json',
    Origin: process.env.NEXT_PUBLIC_APIREQ_URL,
  };

  if (auth === false) {
    delete headers.Authorization;
  }

  if (additionalHeaders) {
    const aH = additionalHeaders;
    headers = {...headers, ...aH};
  }

  return axios({
    method,
    data,
    url: process.env.NEXT_PUBLIC_API_URL + uri,
    headers,
    signal: abortController.signal,
  }).then(function (response) {
    if (response && response.data) return response.data;
    return response;
  });
};

export default apiRequest;
