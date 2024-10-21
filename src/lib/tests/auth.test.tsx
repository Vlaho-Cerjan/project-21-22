import {describe, expect, it, vi} from 'vitest';
import {config, testExports} from '../auth';

// Mock apiRequest function
vi.mock('../apiRouter.ts', () => ({
  default: vi.fn(({uri, method, data, token}) => {
    if (uri === 'auth/login' && method === 'POST') {
      if (data.email === 'test@example.com' && data.password === 'password') {
        return Promise.resolve({success: true, data: {token: 'fake-token'}});
      }
      return Promise.resolve({success: false});
    }
    if (uri === 'api/user' && method === 'GET' && token === 'fake-token') {
      return Promise.resolve({
        success: true,
        data: {id: 1, name: 'Test User', email: 'test@example.com'},
      });
    }
    return Promise.resolve({success: false});
  }),
}));

// Mock getServerSession function
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() =>
    Promise.resolve({
      user: {id: 1, name: 'Test User', email: 'test@example.com'},
    }),
  ),
}));

describe('nextauth.js configuration', () => {
  it('should have the correct providers configuration', () => {
    expect(config.providers).toHaveLength(1);
    expect(config.providers[0]?.name).toBe('Credentials');
  });

  it('should have the correct session strategy', () => {
    expect(config.session.strategy).toBe('jwt');
    expect(config.session.maxAge).toBe(3 * 60 * 60);
    expect(config.session.updateAge).toBe(24 * 60 * 60);
  });

  it('should have the correct JWT configuration', () => {
    expect(config.jwt).toBeDefined();
  });

  it('should have the correct pages configuration', () => {
    expect(config.pages.signIn).toBe('/sign-up');
  });

  it('should have the correct callbacks configuration', async () => {
    const jwtCallback = config.callbacks.jwt;
    const sessionCallback = config.callbacks.session;

    const token = {user: null};
    const user = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: true,
    };
    const account = null;
    const newToken = await jwtCallback({token, user, account});

    expect(newToken.user).toEqual(user);

    const session = {user: null, expires: '2021-01-01T00:00:00Z'};
    // @ts-expect-error - We are testing the callback function
    const newSession = await sessionCallback({session, token: newToken});

    expect(newSession.user).toEqual(user);
  });
});

// TODO - test testExports authorization functions
describe.skip('authorize', () => {
  it('should return user data when valid token is provided', async () => {
    const credentials = {token: 'valid-token'};
    const userRes = {
      success: true,
      data: {},
    };
    const apiRequest = vi.fn().mockResolvedValue(userRes);
    const {authorize} = testExports;
    // @ts-expect-error - We are testing the authorize function
    const result = await authorize(credentials, {apiRequest});

    expect(result).toEqual({
      token: credentials.token,
      ...userRes.data,
    });
    expect(apiRequest).toHaveBeenCalledWith({
      uri: 'api/user',
      method: 'GET',
      token: credentials.token,
      auth: true,
    });
  });

  it('should return login failure cause when invalid credentials are provided', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'wrong-password',
    };
    const loginFailureRes = {success: false};
    const apiRequest = vi.fn().mockResolvedValue(loginFailureRes);
    const {authorize} = testExports;
    // @ts-expect-error - We are testing the authorize function
    const result = await authorize(credentials, {apiRequest});

    expect(result).toEqual({cause: 'Login failed'});
    expect(apiRequest).toHaveBeenCalledWith({
      uri: 'auth/login',
      method: 'POST',
      data: {
        email: credentials.email,
        password: credentials.password,
      },
      auth: false,
    });
  });

  it('should return user data when successful login occurs', async () => {
    const credentials = {email: 'test@example.com', password: 'password'};
    const loginSuccessRes = {success: true, data: {token: 'valid-token'}};
    const userRes = {
      success: true,
      data: {},
    };
    const apiRequest = vi
      .fn()
      .mockResolvedValueOnce(loginSuccessRes)
      .mockResolvedValueOnce(userRes);

    const {authorize} = testExports;
    // @ts-expect-error - We are testing the authorize function
    const result = await authorize(credentials, {apiRequest});

    expect(result).toEqual({
      token: loginSuccessRes.data.token,
      ...userRes.data,
    });
    expect(apiRequest).toHaveBeenCalledWith({
      uri: 'auth/login',
      method: 'POST',
      data: {
        email: credentials.email,
        password: credentials.password,
      },
      auth: false,
    });
    expect(apiRequest).toHaveBeenCalledWith({
      uri: 'api/user',
      method: 'GET',
      token: loginSuccessRes.data.token,
      auth: true,
    });
  });

  it('should return failure cause when user data retrieval fails', async () => {
    const credentials = {token: 'valid-token'};
    const userRes = {success: false};
    const apiRequest = vi.fn().mockResolvedValue(userRes);
    const {authorize} = testExports;
    // @ts-expect-error - We are testing the authorize function
    const result = await authorize(credentials, {apiRequest});

    expect(result).toEqual({cause: 'User data could not be retrieved'});
    expect(apiRequest).toHaveBeenCalledWith({
      uri: 'api/user',
      method: 'GET',
      token: credentials.token,
      auth: true,
    });
  });

  it('should set rememberMe cookie when remember_me is provided', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password',
      remember_me: 'true',
    };
    const loginSuccessRes = {success: true, data: {token: 'valid-token'}};
    const userRes = {
      success: true,
      data: {},
    };
    const apiRequest = vi
      .fn()
      .mockResolvedValueOnce(loginSuccessRes)
      .mockResolvedValueOnce(userRes);
    const setCookieMock = vi.fn();
    const {authorize} = testExports;
    // @ts-expect-error - We are testing the authorize function
    await authorize(credentials, {
      apiRequest,
      cookies: () => ({set: setCookieMock}),
    });

    expect(setCookieMock).toHaveBeenCalledWith('rememberMe', 'true');
  });

  // Add more test cases to cover different scenarios, such as missing credentials, etc.
});
