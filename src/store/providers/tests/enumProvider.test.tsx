import {enumPayload} from '@/mocks/handlers';
import {server} from '@/mocks/server';
import {useAppSelector} from '@/src/hooks';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {Stringify} from '@/src/utils/Stringify';
import {renderWithProviders} from '@/src/utils/testUtils';
import {HttpResponse, delay, http} from 'msw';
import {expect} from 'vitest';

const TestEnumPage = () => {
  const enumData = useAppSelector((state) => state.enum);
  return (
    <div>
      <div data-testid="enumTest">
        {enumData.enumData ? Stringify(enumData.enumData) : 'No enum data'}
      </div>
      <div data-testid="venueTypeTest">
        {enumData.venueType
          ? Stringify(enumData.venueType)
          : 'No venue type data'}
      </div>
    </div>
  );
};

describe('Enum Provider', () => {
  it('should test if the fetchEnum async thunk is working', async () => {
    renderWithProviders(<TestEnumPage />);
    const res = await ClientApiRequest({uri: 'api/enum'});
    const res2 = await ClientApiRequest({uri: 'api/business-types'});

    expect(res).toEqual({
      success: true,
      data: enumPayload.enumData,
    });

    expect(res2).toEqual({
      success: true,
      data: enumPayload.venueType,
    });

    expect(
      document.querySelector('[data-testid="venueTypeTest"]')?.textContent,
    ).toBe(Stringify(enumPayload.venueType));

    expect(
      document.querySelector('[data-testid="enumTest"]')?.textContent,
    ).toBe(Stringify(enumPayload.enumData));
  });

  it('should test if the fetchEnum is working with no enum response', async () => {
    server.resetHandlers();
    server.use(
      http.get(`${process.env.NEXT_PUBLIC_API_URL}api/enum`, async () => {
        await delay(150);
        return HttpResponse.json({
          success: false,
          data: [],
        });
      }),

      http.get(`/api/enum`, async () => {
        await delay(150);
        return HttpResponse.json({
          success: false,
          data: [],
        });
      }),
    );
    renderWithProviders(<TestEnumPage />);
    const res = await ClientApiRequest({uri: 'api/enum'});

    expect(res).toEqual({
      success: false,
      data: [],
    });

    expect(
      document.querySelector('[data-testid="enumTest"]')?.textContent,
    ).toBe('No enum data');
  });
});
