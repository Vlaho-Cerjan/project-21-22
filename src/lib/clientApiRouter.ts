import type {AxiosError, Method} from 'axios';
import axios from 'axios';
import {getSession} from 'next-auth/react';
import {toast} from 'react-toastify';
import {RefreshIfLoggedOut} from '../utils/RefreshIfLoggedOut';

interface ApiReqProps {
  uri: string;
  method?: Method;
  data?: any;
  showError?: boolean;
  auth?: boolean;
  token?: string;
  additionalHeaders?: object;
  abort?: AbortController;
  noRedirect?: boolean;
}

const ClientApiRequest = async function ({
  uri,
  method = 'GET',
  data,
  showError = true,
  auth = false,
  token,
  additionalHeaders,
  abort,
  noRedirect,
}: ApiReqProps) {
  const session: any = await getSession();
  if (!token && (!session || !session.user || !session.user.token)) {
    auth = false;
  }

  const abortController = abort ?? new AbortController();

  let headers: any = {
    Authorization: `Bearer ${token || session?.user.token}`,
    // 'Content-Type': 'application/json',
    Origin: process.env.NEXT_PUBLIC_APIREQ_URL,
    // 'Access-Control-Allow-Origin': '*',
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
    withCredentials: false,
    data: data || undefined,
    url: process.env.NEXT_PUBLIC_API_URL + uri,
    headers,
    signal: abortController.signal,
  })
    .then(function (response) {
      // console.log('response', response);
      if (response && response.data) return response.data;
      return response;
    })
    .catch(async function (error: Error | AxiosError<any>) {
      // console.log('error', error, error.message);
      let message: any = '';
      if (abortController.signal.aborted && error.message === 'canceled') {
        message = 'The user aborted the request';
      } else if ('response' in error) {
        let tempError: any = '';
        if (
          error.response &&
          error.response.data &&
          error.response.data.message &&
          (error.response.data.message === 'invalid_user_token' ||
            error.response.data.message === 'invalid_token' ||
            error.response.data.message === 'unauthorized')
        ) {
          console.log(
            'error.response.data.message',
            error.response.data.message,
          );
          if (error.response.data.message === 'unauthorized') {
            toast.error('Unauthorized', {
              toastId: 'apiError',
            });
          } else
            toast.error('Session expired, please login again', {
              toastId: 'apiError',
            });
          if (!noRedirect)
            await RefreshIfLoggedOut(error.response.data.message);
          if (error.response.data.message === 'unauthorized') {
            return {message: 'Unauthorized'};
          }
          return {message: 'Session expired, please login again'};
        }
        if (
          showError &&
          error.response &&
          error.response.data &&
          error.response.data !== ''
        )
          tempError = error.response.data;
        else if (showError) tempError = 'An error occurred';
        message = tempError;
      } else {
        message = error.message;
      }
      toast.error(message, {
        toastId: 'apiError',
      });
      return {message};
    });
};

export default ClientApiRequest;
