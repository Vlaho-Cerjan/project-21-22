import ClientApiRequest from '@/src/lib/clientApiRouter';
import InputValidationAll from '@/src/utils/InputValidationAll';
import IsItMobile from '@/src/utils/IsItMobileDevice';
import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import {toast} from 'react-toastify';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import SignInSlider from './signUpSlider'; // Adjust the path accordingly

vi.mock('@/src/lib/clientApiRouter', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('@/src/utils/InputValidationAll', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('@/src/utils/IsItMobileDevice', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SignInSlider', () => {
  const setSwiperMock = vi.fn();
  const setPageMock = vi.fn();
  const setVerifiedPhoneMock = vi.fn();
  const openPhoneMock = vi.fn();
  const clearValueMock = vi.fn();
  const onEmailSubmitMock = vi.fn();

  const pageData = [
    {
      inputName: 'name',
      title: 'Name',
      description: 'Enter your name.',
      value: 'test',
      type: 'text',
      setValue: vi.fn(),
    },
    {
      inputName: 'mobileNumber',
      title: 'Mobile Number',
      description: 'Mobile Number',
      value: '+385955608459',
      type: 'tel',
      setValue: vi.fn(),
    },
    {
      inputName: 'password',
      title: 'Password',
      description: 'Password',
      value: 'G4m3Fr34k004$$$###',
      type: 'password',
      setValue: vi.fn(),
    },
    {
      inputName: 'email',
      title: 'Email',
      description: 'Email',
      value: 'test@test.com',
      type: 'email',
      setValue: vi.fn(),
    },
  ];

  const businessData: any = {
    email: 'test@test.com',
    mobile_number: '+385955608459',
    name: 'Test User',
    password: 'G4m3Fr34k004$$$###',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (InputValidationAll as any).mockReturnValue(true);
  });

  it('renderWithProviders SignInSlider with Swiper and PageComponent', async () => {
    renderWithProviders(
      <SignInSlider
        swiper={null}
        setSwiper={setSwiperMock}
        id="signInSlider"
        page={1}
        setPage={setPageMock}
        pageData={pageData}
        openPhone={openPhoneMock}
        verifiedPhone={false}
        setVerifiedPhone={setVerifiedPhoneMock}
        businessData={businessData}
        clearValue={clearValueMock}
        onEmailSubmit={onEmailSubmitMock}
      />,
    );

    expect(screen.getByTestId('pageComponent_name')).toBeInTheDocument();
  });

  it('sends verification code when mobile number is entered', async () => {
    (ClientApiRequest as any).mockResolvedValue({success: true});
    renderWithProviders(
      <SignInSlider
        swiper={null}
        setSwiper={setSwiperMock}
        id="signInSlider"
        page={2}
        setPage={setPageMock}
        pageData={pageData}
        openPhone={openPhoneMock}
        verifiedPhone={false}
        setVerifiedPhone={setVerifiedPhoneMock}
        businessData={businessData}
        clearValue={clearValueMock}
        onEmailSubmit={onEmailSubmitMock}
      />,
    );

    fireEvent.keyUp(window, {key: 'Enter'});

    await waitFor(() => {
      expect(ClientApiRequest).toHaveBeenCalledWith({
        uri: 'auth/phone-verification-request',
        method: 'POST',
        data: {mobile_number: '+385955608459'},
        auth: false,
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Verification code sent successfully',
      );
    });
  });

  it('handles page change on Enter key press', () => {
    renderWithProviders(
      <SignInSlider
        swiper={null}
        setSwiper={setSwiperMock}
        id="signInSlider"
        page={1}
        setPage={setPageMock}
        pageData={pageData}
        openPhone={openPhoneMock}
        verifiedPhone
        setVerifiedPhone={setVerifiedPhoneMock}
        businessData={businessData}
        clearValue={clearValueMock}
        onEmailSubmit={onEmailSubmitMock}
      />,
    );

    fireEvent.keyUp(window, {
      key: 'Enter',
    });

    expect(setPageMock).toHaveBeenCalledWith(2);
  });

  it('validates input fields on slide change', () => {
    (InputValidationAll as any).mockReturnValue(false);
    renderWithProviders(
      <SignInSlider
        swiper={null}
        setSwiper={setSwiperMock}
        id="signInSlider"
        page={1}
        setPage={setPageMock}
        pageData={pageData}
        openPhone={openPhoneMock}
        verifiedPhone
        setVerifiedPhone={setVerifiedPhoneMock}
        businessData={businessData}
        clearValue={clearValueMock}
        onEmailSubmit={onEmailSubmitMock}
      />,
    );

    fireEvent.keyUp(window, {
      key: 'Enter',
    });

    expect(InputValidationAll).toHaveBeenCalled();
    expect(screen.getByTestId('pageComponent_mobileNumber')).toBeVisible();
  });

  it('disables next slide if validation fails', () => {
    (InputValidationAll as any).mockReturnValue(false);
    renderWithProviders(
      <SignInSlider
        swiper={null}
        setSwiper={setSwiperMock}
        id="signInSlider"
        page={1}
        setPage={setPageMock}
        pageData={pageData}
        openPhone={openPhoneMock}
        verifiedPhone
        setVerifiedPhone={setVerifiedPhoneMock}
        businessData={businessData}
        clearValue={clearValueMock}
        onEmailSubmit={onEmailSubmitMock}
      />,
    );

    fireEvent.keyUp(window, {
      key: 'Enter',
    });

    expect(InputValidationAll).toHaveBeenCalled();
    expect(screen.getByTestId('pageComponent_name')).toBeVisible();
  });

  it('handles email submission when email page is active', () => {
    renderWithProviders(
      <SignInSlider
        swiper={null}
        setSwiper={setSwiperMock}
        id="signInSlider"
        page={4}
        setPage={setPageMock}
        pageData={pageData}
        openPhone={openPhoneMock}
        verifiedPhone
        setVerifiedPhone={setVerifiedPhoneMock}
        businessData={businessData}
        clearValue={clearValueMock}
        onEmailSubmit={onEmailSubmitMock}
      />,
    );

    fireEvent.keyUp(window, {key: 'Enter'});

    expect(onEmailSubmitMock).toHaveBeenCalled();
  });

  it('opens phone verification modal when mobile number page is active and phone not verified', () => {
    renderWithProviders(
      <SignInSlider
        swiper={null}
        setSwiper={setSwiperMock}
        id="signInSlider"
        page={2}
        setPage={setPageMock}
        pageData={pageData}
        openPhone={openPhoneMock}
        verifiedPhone={false}
        setVerifiedPhone={setVerifiedPhoneMock}
        businessData={businessData}
        clearValue={clearValueMock}
        onEmailSubmit={onEmailSubmitMock}
      />,
    );

    fireEvent.keyUp(window, {key: 'Enter'});

    expect(openPhoneMock).toHaveBeenCalledWith(true);
  });

  it('checks for mobile device and sets state accordingly', () => {
    (IsItMobile as any).mockReturnValue(true);
    renderWithProviders(
      <SignInSlider
        swiper={null}
        setSwiper={setSwiperMock}
        id="signInSlider"
        page={1}
        setPage={setPageMock}
        pageData={pageData}
        openPhone={openPhoneMock}
        verifiedPhone
        setVerifiedPhone={setVerifiedPhoneMock}
        businessData={businessData}
        clearValue={clearValueMock}
        onEmailSubmit={onEmailSubmitMock}
      />,
    );

    expect(IsItMobile).toHaveBeenCalled();
    expect(screen.getByTestId('pageComponent_name')).toBeVisible();
  });
});
