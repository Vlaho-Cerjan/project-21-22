import {delay, http, HttpResponse} from 'msw';

export const testServerApi = 'http://localhost:3000/api/';
export const apiRequestPath = 'https://content-management.project-dev.tv/api/';

export const enumPayload = {
  enumData: {
    test: 'test',
  },
  venueType: {
    test: 'test',
  },
};

export const handlers = [
  // Handles a GET /test request
  http.get(`${process.env.NEXT_PUBLIC_API_URL}api/enum`, async () => {
    await delay(150);
    return HttpResponse.json({
      success: true,
      data: enumPayload.enumData,
    });
  }),

  http.get(`${process.env.NEXT_PUBLIC_API_URL}api/business-types`, async () => {
    await delay(150);
    return HttpResponse.json({
      success: true,
      data: enumPayload.venueType,
    });
  }),

  http.get(`/api/enum`, async () => {
    await delay(150);
    return HttpResponse.json({
      success: true,
      data: enumPayload.enumData,
    });
  }),

  http.get(`/api/business-types`, async () => {
    await delay(150);
    return HttpResponse.json({
      success: true,
      data: enumPayload.venueType,
    });
  }),

  http.get(`${process.env.NEXT_PUBLIC_API_URL}api/user`, async () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: '9e0b6cb0-cd06-11ee-a60c-5f55d255dff5',
          email: 'vlaho@project.tv',
          mobile_number: null,
          first_name: 'Vlaho',
          last_name: 'Cerjan',
          job_title: 'Senior Frontend Developer',
          image: 0,
          created_at: '2024-02-16T20:04:40+00:00',
          updated_at: '2024-04-04T18:03:25+00:00',
          roles: [
            {
              id: '816ee690-cb95-11ee-99d3-9fe18e1a734d',
              name: 'project_admin',
            },
          ],
        },
      },
    });
  }),

  // Handles a POST /api/auth/_log request
  http.post(`/api/auth/_log`, async () => {
    return HttpResponse.json({
      success: true,
      data: {
        test: 'test',
      },
    });
  }),

  // Handles a POST /api/auth/session request
  http.get(`/api/auth/session`, async () => {
    return HttpResponse.json({
      success: true,
      user: {
        token: '103|x3DKHPxD59LREXJ9rk0N7JtcUHXMpEagoxGeswtxb2b72371',
        id: '9e0b6cb0-cd06-11ee-a60c-5f55d255dff5',
        email: 'vlaho@project.tv',
        first_name: null,
        last_name: null,
        job_title: null,
        image: 0,
        created_at: '2024-02-16T20:04:40+00:00',
        updated_at: '2024-02-16T20:04:40+00:00',
        roles: [
          {
            id: '816ee690-cb95-11ee-99d3-9fe18e1a734d',
            name: 'project_admin',
          },
        ],
      },
      expires: '2024-04-13T23:27:30.906Z',
    });
  }),

  http.post(
    `${process.env.NEXT_PUBLIC_API_URL}auth/phone-verification-request`,
    async () => {
      return HttpResponse.json({
        success: true,
        data: {
          success: true,
        },
      });
    },
  ),
];
