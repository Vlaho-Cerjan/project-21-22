'use client';

import React from 'react';
import type Swiper from 'swiper';

import Footer from '@/src/components/auth/common/footer/footer';
import type {PageData} from '@/src/components/auth/pageComponent/pageComponent';
import SignInSlider from '@/src/components/auth/signUpSlider/signUpSlider';
import {Zupanije} from '@/src/constants/zupanije';
import {useAppSelector} from '@/src/hooks';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {BusinessTypeState} from '@/src/store/slices/enumSlice';
import InputValidationAll from '@/src/utils/InputValidationAll';
import type {RegistrationData} from '@/types/registrations';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';

const verifyCode = async (phone: string, code: string) => {
  const response: {
    success: boolean;
  } = await ClientApiRequest({
    uri: 'auth/phone-verification-code',
    method: 'PUT',
    data: {
      mobile_number: phone,
      code,
    },
    auth: false,
  });

  return response;
};
/*
const submitOrder = async (data: {
  venueData: RegistrationData;
  shippingData: RegistrationData;
  counter: number;
}) => {
  const response: {
    success: boolean;
  } = await ClientApiRequest({
    uri: 'api/order',
    method: 'POST',
    data,
    auth: true,
  });

  return response;
};
*/
const registerBusiness = async (data: RegistrationData) => {
  const response: {
    success: boolean;
  } = await ClientApiRequest({
    uri: 'api/registration',
    method: 'POST',
    data,
    auth: false,
  });

  return response;
};

const VerifyPhoneModalLazy = dynamic(
  () => import('@/src/components/auth/verifyPhoneModal/verifyPhoneModal'),
  {
    ssr: false,
  },
);

/* const OrderModalLazy = dynamic(
  () => import('@/src/components/orders/orderModal/orderModal'),
  {
    ssr: false,
  },
);
*/
export default function SignUp() {
  const router = useRouter();
  const [swiper, setSwiper] = React.useState<Swiper | null>(null);
  const [page, setPage] = React.useState(1);
  const [businessName, setBusinessName] = React.useState('');
  const [businessLocation, setBusinessLocation] = React.useState('');
  const [businessWebsite, setBusinessWebsite] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  // const [username, setUsername] = React.useState('');
  // const [password, setPassword] = React.useState('');
  // [confirmPassword, setConfirmPassword] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [venueTypeData, setVenueTypeData] = React.useState({
    id: '',
    name: '',
  });
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const {setLoading} = React.useContext(LoadingContext);
  // const [counter, setCounter] = React.useState<number>(1);
  const [businessData, setBusinessData] = React.useState<RegistrationData>({
    job_title: '',
    status: 0,
    business_name: '',
    address_1: '',
    address_2: '',
    city: '',
    state_code: '',
    zip: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    phone_number: '',
    country_code: '',
    longitude: 0,
    latitude: 0,
    business_type_id: '',
  });

  // const [shippingData, setShippingData] = React.useState(businessData);

  // const [venueData, setVenueData] = React.useState(businessData);

  const {venueType} = useAppSelector((state) => state.enum);

  const [venueTypes, setVenueTypes] = React.useState<BusinessTypeState[]>([]);

  const [modalDelayOpen, setModalDelayOpen] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setModalDelayOpen(true);
    }, 1000);
  }, []);

  React.useEffect(() => {
    if (venueType && venueType.length > 0) {
      setVenueTypes(venueType);
      setVenueTypeData(venueType[0] || {id: '', name: ''});
    }
  }, [venueType]);

  useDidUpdateEffect(() => {
    const fullNameSplit = fullName.split(' ');

    setBusinessData((prev) => ({
      ...prev,
      business_name: businessName,
      first_name: fullNameSplit[0] || '',
      last_name: fullNameSplit[1] || '',
      email,
      phone_number: phoneNumber,
      mobile_number: mobileNumber,
      website: businessWebsite,
      // username,
      business_type_id: venueTypeData.id,
    }));
    /*
    setShippingData((prev) => ({
      ...prev,
      business_name: businessName,
      first_name: fullNameSplit[0] || '',
      last_name: fullNameSplit[1] || '',
      email,
      phone_number: mobileNumber,
      mobile_number: mobileNumber,
      website: businessWebsite,
      username,
      business_type_id: venueType,
    }));
    setVenueData((prev) => ({
      ...prev,
      business_name: businessName,
      first_name: fullNameSplit[0] || '',
      last_name: fullNameSplit[1] || '',
      email,
      phone_number: mobileNumber,
      mobile_number: mobileNumber,
      website: businessWebsite,
      username,
      business_type_id: venueType,
    }));
    */
  }, [
    businessName,
    businessWebsite,
    fullName,
    // username,
    phoneNumber,
    mobileNumber,
    email,
    venueType,
  ]);

  const onFullNameSubmit = (value: string) => {
    // set username to lowercase value separated by underscores
    // setUsername((value as string).toLowerCase().replaceAll(' ', '_'));
    setFullName(value);
  };

  const [verifiedPhone, setVerifiedPhone] = React.useState(false);

  const [openPhoneModal, setOpenPhoneModal] = React.useState(false);

  /* const [openOrderModal, setOpenOrderModal] = React.useState(false);

  React.useEffect(() => {
    if (openOrderModal) {
      document.body.classList.add('order-modal-open');
    } else {
      document.body.classList.remove('order-modal-open');
    }
  }, [openOrderModal]);
*/
  const onEmailSubmit = async () => {
    setLoading(true);
    const res = await registerBusiness(businessData);
    if (res.success) {
      toast.success('Business registered successfully');
      router.push('/registration-complete');
    } else toast.error('Error registering business');
    setLoading(false);
  };

  const clearValue = (inputName: string) => {
    const input = document.querySelector(`input[name=${inputName}]`);
    const errorEl = document.querySelector(`.errorContainer.${inputName}`);
    if (input) input.classList.remove('error');
    if (errorEl) {
      errorEl.classList.remove('active');
      errorEl.removeAttribute('style');
    }

    switch (inputName) {
      case 'businessName':
        setBusinessName('');
        break;
      case 'businessLocation':
        setBusinessLocation('');
        break;
      case 'businessWebsite':
        setBusinessWebsite('');
        break;
      case 'fullName':
        setFullName('');
        break;
      // case 'username':
      //  setUsername('');
      //  break;
      // case 'newPassword':
      //  setPassword('');
      //  break;
      // case 'confirmPassword':
      //  setConfirmPassword('');
      //  break;
      case 'phoneNumber':
        setPhoneNumber('');
        break;
      case 'mobileNumber':
        setMobileNumber('');
        break;
      case 'venueType':
        setVenueTypeData({
          id: '',
          name: '',
        });
        break;
      case 'email':
        setEmail('');
        break;
      default:
        break;
    }
  };

  const pageData: PageData[] = React.useMemo(
    () => [
      {
        title: (
          <>
            Let&apos;s start with your <strong>business</strong> name.
          </>
        ),
        description: 'Texas Roadhouse, Margaritaville, etc.',
        inputName: 'businessName',
        inputLabel: 'Business Name',
        value: businessName,
        setValue: (e) => {
          setBusinessName(e.target.value);
        },
        errorMessage: 'Enter your business name.',
      },
      {
        title: (
          <>
            Where is your business <strong>located</strong>?
          </>
        ),
        description: 'Enter your main business address.',
        inputName: 'businessLocation',
        inputLabel: 'Business Location',
        value: businessLocation,
        setAutocompleteValue: (place) => {
          const currPage = 2;
          if (place) {
            if (typeof place === 'string') {
              setBusinessLocation(place as string);
              setBusinessData((prev) => ({
                ...prev,
                address_1: '',
                city: '',
                state_code: '',
                zip: '',
                latitude: 0,
                longitude: 0,
                country_code: '',
              }));
            } else {
              const address = place.formatted_address || place.name;
              setBusinessLocation(address || '');
              const addressComponents = place.address_components || [];

              //console.log(addressComponents, 'addressComponents');
              const {location} = place?.geometry || {};
              if (!location) return;
              const {lat, lng} = location;
              if (
                typeof addressComponents !== 'undefined' &&
                addressComponents.length > 0
              ) {
                // get street number and street name
                const streetNumber = addressComponents.find((component) => {
                  return component.types.includes('street_number');
                })?.long_name;

                const street = addressComponents.find((component) => {
                  return component.types.includes('route');
                })?.long_name;

                const streetAddress = streetNumber
                  ? `${streetNumber} ${street}`
                  : street;
                // get city
                let city = addressComponents.find((component) => {
                  return component.types.includes('locality');
                })?.long_name;

                if (!city) {
                  city = addressComponents.find((component) => {
                    return component.types.includes('postal_town');
                  })?.long_name;
                }
                // get state
                const state = {
                  code: addressComponents.find((component) => {
                    return component.types.includes(
                      'administrative_area_level_1',
                    );
                  })?.short_name,
                };

                if (Zupanije[state.code as keyof typeof Zupanije]) {
                  state.code = Zupanije[state.code as keyof typeof Zupanije];
                }

                const country = addressComponents.find((component) => {
                  return component.types.includes('country');
                })?.short_name;
                // get zip code
                const zip = addressComponents.find((component) => {
                  return component.types.includes('postal_code');
                })?.long_name;

                if (
                  !streetNumber ||
                  !streetAddress ||
                  !city ||
                  !state ||
                  !country ||
                  !zip
                ) {
                  const missingFields = [
                    !streetNumber && 'street number',
                    !streetAddress && 'street name',
                    !city && 'city',
                    !state && 'state',
                    !country && 'country',
                    !zip && 'zip code',
                  ]
                    .filter(Boolean)
                    .join(', ');
                  toast.error(
                    `Please enter a valid address. Missing ${missingFields}`,
                  );
                  return;
                }

                const newBusinessData = {
                  ...businessData,
                  address_1: streetAddress || '',
                  city: city || '',
                  state_code: `${country}-${state.code}` || '',
                  country_code: country || '',
                  zip: zip || '',
                  longitude: lng(),
                  latitude: lat(),
                };

                const pageComponent =
                  document.querySelectorAll('.pageComponent')[currPage - 1];
                const inputEl = pageComponent?.querySelectorAll(
                  'input[required], textarea[required], select[required]',
                );
                const errorEl =
                  pageComponent?.querySelectorAll('.errorContainer');

                if (inputEl)
                  InputValidationAll(inputEl, errorEl, false, newBusinessData);

                // set businessData
                setBusinessData((prev) => ({
                  ...prev,
                  ...newBusinessData,
                }));
                /*
              setShippingData((prev) => ({
                ...prev,
                address_1: streetAddress || '',
                city: city || '',
                state_code: state || '',
                country_code: country || '',
                zip: zip || '',
                longitude: lng(),
                latitude: lat(),
              }));
              setVenueData((prev) => ({
                ...prev,
                address_1: streetAddress || '',
                city: city || '',
                state_code: state || '',
                country_code: country || '',
                zip: zip || '',
                longitude: lng(),
                latitude: lat(),
              }));
              */
              }
            }
          } else setBusinessLocation('');
        },
        errorMessage:
          'Enter your business address so we can ship your free Project Player.',
      },
      {
        title: (
          <>
            What is your business <strong>web address</strong>?
          </>
        ),
        description: 'So customers can find your business with us.',
        inputName: 'businessWebsite',
        inputLabel: 'Business Website',
        value: businessWebsite,
        setValue: (e) => setBusinessWebsite(e.target.value),
        errorMessage: 'Enter your business website.',
        type: 'url',
      },
      {
        title: (
          <>
            What&apos;s your <strong>first</strong> and <strong>last</strong>{' '}
            name?
          </>
        ),
        description: 'Marie Curie, Albert Einstein, etc.',
        inputName: 'fullName',
        inputLabel: 'Full Name',
        value: fullName,
        setValue: (e) => onFullNameSubmit(e.target.value),
        errorMessage: 'Enter your full name.',
      },
      /*
      {
        title: (
          <>
            Does this <strong>username</strong> look good?
          </>
        ),
        description: 'Change it to whatever you like',
        inputName: 'username',
        inputLabel: 'Username',
        value: username,
        setValue: (e) => setUsername(e.target.value),
      },
      */
      {
        title: (
          <>
            What <strong>venue type</strong> is your business?
          </>
        ),
        type: 'select',
        description: 'Choose one of the following options.',
        inputName: 'venueType',
        inputLabel: 'Venue Type',
        value: venueTypeData,
        setValue: (tData) => setVenueTypeData(tData),
        searchData: venueTypes,
        searchKeys: ['name'],
        displayValue: 'Venue Type',
        display: {
          topLeft: 'name',
        },
        dataName: 'Venue Types',
      },
      /*
    {
      title: (
        <>
          Choose a <strong>password</strong> to sign in with.
        </>
      ),
      description:
        'minimum 8 characters with a mix of letters, numbers, and symbols.',
      inputName: 'newPassword',
      type: 'password',
      value: password,
      autocomplete: 'new-password',
      setValue: (e) => setPassword(e.target.value),
      errorMessage:
        'Your password has to be at least 8 characters long, and contain a mix of letters (uppercase and lowercase), numbers, and symbols.',
    },
    {
      title: (
        <>
          Please confirm your new <strong>password</strong>.
        </>
      ),
      description: '',
      inputName: 'confirmPassword',
      type: 'password',
      value: confirmPassword,
      autocomplete: 'confirm-password',
      setValue: (e) => setConfirmPassword(e.target.value),
      errorMessage:
        'Your password does not match the one you entered previously. Please try again.',
    },
    */
      {
        title: (
          <>
            What is your <strong>phone</strong> number?
          </>
        ),
        description: 'Please write your business phone number.',
        inputName: 'phoneNumber',
        inputLabel: 'Phone Number',
        value: phoneNumber,
        setValue: (val: string) => setPhoneNumber(val),
        type: 'tel',
        errorMessage: 'Enter a valid phone number',
      },
      {
        title: (
          <>
            What is your <strong>mobile</strong> number?
          </>
        ),
        description:
          'So we can secure your account with two-factor authentication.',
        inputName: 'mobileNumber',
        inputLabel: 'Mobile Number',
        value: mobileNumber,
        setValue: (val: string) => setMobileNumber(val),
        type: 'tel',
        errorMessage: 'Enter a valid mobile number',
      },
      {
        title: (
          <>
            And lastly, what&apos;s your business <strong>email</strong>{' '}
            address?
          </>
        ),
        description: 'To send account updates, reset your password and more.',
        type: 'email',
        inputName: 'email',
        inputLabel: 'Email Address',
        value: email,
        setValue: (e) => setEmail(e.target.value),
        errorMessage: 'Enter a valid email address.',
      },
    ],
    [
      venueTypeData,
      businessData,
      fullName,
      // username,
      phoneNumber,
      mobileNumber,
      email,
      businessName,
      businessLocation,
      businessWebsite,
      venueType,
    ],
  );

  return (
    <div className="childContainer">
      <SignInSlider
        swiper={swiper}
        setSwiper={setSwiper}
        id="signInSlider"
        openPhone={setOpenPhoneModal}
        page={page}
        setPage={setPage}
        pageData={pageData}
        verifiedPhone={verifiedPhone}
        setVerifiedPhone={setVerifiedPhone}
        businessData={businessData}
        clearValue={clearValue}
        onEmailSubmit={onEmailSubmit}
      />
      <Footer
        openPhone={setOpenPhoneModal}
        verifiedPhone={verifiedPhone}
        onEmailSubmit={onEmailSubmit}
        page={page}
        limit={pageData.length}
        setPage={setPage}
        businessData={businessData}
      />
      {modalDelayOpen && (
        <>
          <VerifyPhoneModalLazy
            open={openPhoneModal}
            setOpen={setOpenPhoneModal}
            mobileNumber={mobileNumber}
            verifyPhoneFunction={async (code: string) => {
              setLoading(true);
              const res = await verifyCode(mobileNumber, code);
              if (res.success) {
                setOpenPhoneModal(false);
                setVerifiedPhone(true);
                setLoading(false);
                setPage(page + 1);
                return Promise.resolve('success');
              }
              setLoading(false);
              return Promise.resolve('error');
            }}
          />
          {/*
          <OrderModalLazy
            open={openOrderModal}
            setOpen={setOpenOrderModal}
            counter={counter}
            setCounter={setCounter}
            verifyOrderFunction={async () => {
              setLoading(true);
              const res = await submitOrder({
                venueData,
                shippingData,
                counter,
              });
              if (res.success) {
                toast.success(
                  'Order submitted, it will be processed once your account is verified.',
                );
                setTimeout(() => {
                  router.push('/registration-complete');
                }, 1000);
              } else {
                toast.error('Error submitting order');
              }
              setLoading(false);
            }}
            venueData={venueData}
            setVenueData={setVenueData}
            shippingData={shippingData}
            setShippingData={setShippingData}
          />
          */}
        </>
      )}
    </div>
  );
}
