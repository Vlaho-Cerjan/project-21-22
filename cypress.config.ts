import {defineConfig} from 'cypress';
import {setupServer} from 'msw/node';
import {handlers} from './mocks/handlers';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
    env: {
      Project_USER: 'username@company.com',
      Project_PW: 'password',
      COOKIE_NAME: 'next-auth.session-token',
      SITE_NAME: 'http://localhost:3000',
      Project_API: 'https://portal.project-dev.tv/',
      NEXTAUTH_URL: 'http://localhost:3000',
      VITE_APIREQ_URL: 'http://localhost:3000',
      NEXTAUTH_SECRET: 'b443dfd1c6ad715232e7165c47bd516f',
    },
    setupNodeEvents: (on) => {
      // start msw server before tests
      on('task', {
        async mockServer() {
          if (typeof window === 'undefined') {
            const server = setupServer(...handlers);
            server.listen();
            return null;
          }
          return null;
        },
      });
    },
  },
});
