// Import statements
import ModalInputLabel from '@/src/components/common/modalInputLabel/modalInputLabel';
import * as ClientApiRequest from '@/src/lib/clientApiRouter';
import {renderWithProviders} from '@/src/utils/testUtils';
import {screen} from '@/test/utilities';
import userEvent from '@testing-library/user-event';
import {toast} from 'react-toastify';
import * as useHooksTs from 'usehooks-ts';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import SignUpFooter from './footer';

// Mocking necessary imports
vi.mock('usehooks-ts');
vi.mock('react-toastify');
vi.mock('@/src/lib/clientApiRouter');
// mock ClientApiRequest
describe('<SignUpFooter />', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
    // Mock useWindowSize to return a specific width
    vi.spyOn(useHooksTs, 'useWindowSize').mockReturnValue({
      width: 768,
      height: 1024,
    });
    vi.spyOn(ClientApiRequest, 'default').mockReturnValue(
      Promise.resolve({success: true}),
    );
  });

  it('renders correctly with default props', () => {
    renderWithProviders(
      <SignUpFooter
        page={1}
        limit={5}
        setPage={() => {}}
        openPhone={() => {}}
      />,
    );
    expect(screen.getByTestId('termsOfService')).toHaveAttribute(
      'href',
      '/terms-of-service',
    );
    expect(screen.getByTestId('privacyPolicy')).toHaveAttribute(
      'href',
      '/privacy-policy',
    );
    expect(screen.getByTestId('leftArrow')).toBeDisabled();
    expect(screen.queryByTestId('mobilePageNumber')).not.toBeInTheDocument(); // Expect not to find mobile page number on desktop width
  });

  it('enables the left arrow button when page is greater than 1', () => {
    renderWithProviders(
      <SignUpFooter
        page={2}
        limit={5}
        setPage={() => {}}
        openPhone={() => {}}
      />,
    );
    expect(screen.getByTestId('leftArrow')).toBeEnabled();
  });

  it('should disable right arrow button when page is bigger than limit', () => {
    renderWithProviders(
      <SignUpFooter
        page={6}
        limit={5}
        setPage={() => {}}
        openPhone={() => {}}
      />,
    );
    expect(screen.getByTestId('rightArrow')).toBeDisabled();
  });

  it('calls setPage with the previous page number on left arrow click', async () => {
    const setPageMock = vi.fn();
    renderWithProviders(
      <SignUpFooter
        page={2}
        limit={5}
        setPage={setPageMock}
        openPhone={() => {}}
      />,
    );
    await userEvent.click(screen.getByTestId('leftArrow'));
    expect(setPageMock).toHaveBeenCalledWith(1);
  });

  it('handles the right arrow click and validation correctly', async () => {
    const setPageMock = vi.fn();
    renderWithProviders(
      <div>
        <div className="pageComponent">
          <ModalInputLabel
            labelText="Email"
            errorText="Invalid email"
            inputProps={{
              type: 'email',
              name: 'email',
              placeholder: 'Email',
              'data-testid': 'emailInput',
              required: true,
              value: 'test@test.com',
            }}
          />
        </div>
        <SignUpFooter
          page={1}
          limit={2}
          setPage={setPageMock}
          openPhone={() => {}}
          verifiedPhone
        />
      </div>,
    );

    await userEvent.click(screen.getByTestId('rightArrow'));
    expect(setPageMock).toHaveBeenCalled();
  });

  it('renders mobile page numbers when screen width is below 768px', () => {
    vi.spyOn(useHooksTs, 'useWindowSize').mockReturnValue({
      width: 600,
      height: 800,
    }); // Simulate mobile width
    renderWithProviders(
      <SignUpFooter
        page={1}
        limit={5}
        setPage={() => {}}
        openPhone={() => {}}
      />,
    );
    expect(screen.getByTestId('mobilePageNumber')).toBeInTheDocument();
    expect(screen.getByText('of')).toBeInTheDocument();
  });

  it('opens phone verification modal on last but one page if phone not verified', async () => {
    const openPhoneMock = vi.fn();
    const setPageMock = vi.fn();
    vi.spyOn(useHooksTs, 'useWindowSize').mockReturnValue({
      width: 1024,
      height: 800,
    }); // Simulate desktop width
    renderWithProviders(
      <div>
        <div className="pageComponent" />
        <div className="pageComponent">
          <ModalInputLabel
            labelText="Mobile Number"
            errorText="Invalid Number"
            inputProps={{
              type: 'tel',
              name: 'mobileNumber',
              placeholder: 'Mobile Number',
              'data-testid': 'mobileNumber',
              required: true,
              value: '0955608459',
            }}
          />
        </div>
        <div className="pageComponent" />
        <SignUpFooter
          page={2}
          limit={3}
          setPage={setPageMock}
          openPhone={openPhoneMock}
          verifiedPhone={false}
          businessData={{
            email: 'test@test.com',
            phone_number: '0955608459',
            mobile_number: '0955608459',
            business_type_id: 'bar',
            first_name: 'John',
            last_name: 'Doe',
            status: 0,
            business_name: 'Test Business',
            job_title: 'Manager',
            address_2: 'Apt 1',
            address_1: '123 Main St',
            city: 'New York',
            state_code: 'NY',
            country_code: 'US',
            zip: '10001',
            latitude: 40.7128,
            longitude: -74.006,
          }}
        />
      </div>,
    );

    await userEvent.click(screen.getByTestId('rightArrow'));
    expect(openPhoneMock).toHaveBeenCalled();
  });

  it('calls onEmailSubmit on the last page with valid inputs', async () => {
    const onEmailSubmitMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolve({success: true});
        }),
    );
    const setPageMock = vi.fn();
    renderWithProviders(
      <div>
        <div className="pageComponent" />
        <div className="pageComponent" />
        <div className="pageComponent">
          <ModalInputLabel
            labelText="Email"
            errorText="Invalid email"
            inputProps={{
              type: 'email',
              name: 'email',
              placeholder: 'Email',
              'data-testid': 'emailInput',
              required: true,
              value: 'test@gmail.com',
            }}
          />
        </div>
        <SignUpFooter
          page={3}
          limit={3}
          setPage={setPageMock}
          openPhone={() => {}}
          verifiedPhone
          businessData={{
            email: 'test@gmail.com',
            phone_number: '1234567890',
            mobile_number: '1234567890',
            business_type_id: 'bar',
            first_name: 'John',
            last_name: 'Doe',
            business_name: 'Test Business',
            address_1: '123 Main St',
            address_2: 'Apt 1',
            job_title: 'Manager',
            status: 0,
            city: 'New York',
            state_code: 'NY',
            country_code: 'US',
            zip: '10001',
            latitude: 40.7128,
            longitude: -74.006,
          }}
          onEmailSubmit={onEmailSubmitMock}
        />
      </div>,
    );

    await userEvent.click(screen.getByTestId('rightArrow'));
    expect(onEmailSubmitMock).toHaveBeenCalled();
  });

  it('displays error toast when sending verification code fails', async () => {
    vi.spyOn(ClientApiRequest, 'default').mockReturnValue(
      Promise.resolve({success: false}),
    );
    const openPhoneMock = vi.fn();
    renderWithProviders(
      <div>
        <div className="pageComponent" />
        <div className="pageComponent">
          <ModalInputLabel
            labelText="Mobile Number"
            errorText="Invalid Number"
            inputProps={{
              type: 'tel',
              name: 'mobileNumber',
              placeholder: 'Mobile Number',
              'data-testid': 'mobileNumber',
              required: true,
              value: '0955608459',
            }}
          />
        </div>
        <div className="pageComponent" />
        <SignUpFooter
          page={2}
          limit={3}
          setPage={() => {}}
          openPhone={openPhoneMock}
          verifiedPhone={false}
          businessData={{
            email: 'test@test.com',
            phone_number: '0955608459',
            mobile_number: '0955608459',
            business_type_id: 'bar',
            first_name: 'John',
            last_name: 'Doe',
            business_name: 'Test Business',
            address_1: '123 Main St',
            address_2: 'Apt 1',
            job_title: 'Manager',
            status: 0,
            city: 'New York',
            state_code: 'NY',
            country_code: 'US',
            zip: '10001',
            latitude: 40.7128,
            longitude: -74.006,
          }}
        />
      </div>,
    );

    await userEvent.click(screen.getByTestId('rightArrow'));
    expect(toast.error).toHaveBeenCalledWith(
      'Error sending verification code',
      {
        autoClose: false,
      },
    );
  });
});
