'use client';

import type {Dispatch, SetStateAction} from 'react';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import StyledLink from '@/src/components/common/link/link';
import Text from '@/src/components/common/text/text';
import MemoLeftArrow from '@/src/icons/left-arrow';
import MemoRightArrow from '@/src/icons/right-arrow';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import InputValidationAll from '@/src/utils/InputValidationAll';
import type {RegistrationData} from '@/types/registrations';
import {toast} from 'react-toastify';

const sendVerificationCode = async (phone: string) => {
  const response: {
    success: boolean;
  } = await ClientApiRequest({
    uri: 'auth/phone-verification-request',
    method: 'POST',
    data: {phone_number: phone},
    auth: false,
  });

  if (!response.success)
    toast.error('Error sending verification code', {
      autoClose: false,
    });

  return response;
};

export default function SignUpFooter({
  page,
  limit,
  setPage,
  openPhone,
  verifiedPhone,
  businessData,
  onEmailSubmit,
}: {
  page: number;
  limit: number;
  setPage: Dispatch<SetStateAction<number>>;
  openPhone: Dispatch<SetStateAction<boolean>>;
  verifiedPhone?: boolean;
  businessData?: RegistrationData;
  onEmailSubmit?: () => void;
}) {
  const {width} = useWindowSize();

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (width && width < 768) setIsMobile(true);
    else setIsMobile(false);
  }, [width]);

  return (
    <footer className="footer">
      <Text className="lightText">
        By clicking &quot;OK&quot; you agree to our{' '}
        <StyledLink
          target="_blank"
          data-testid="termsOfService"
          href="/terms-of-service"
        >
          Terms of Service
        </StyledLink>{' '}
        and{' '}
        <StyledLink
          target="_blank"
          data-testid="privacyPolicy"
          href="/privacy-policy"
        >
          Privacy Policy
        </StyledLink>
        .
      </Text>
      <div className="arrowButtonsContainer">
        {isMobile ? (
          <div data-testid="mobilePageNumber" className="pageNumberContainer">
            <Text>{page}</Text>
            <Text className="lightText" style={{margin: '0 6px'}}>
              of
            </Text>
            <Text>{limit}</Text>
          </div>
        ) : null}
        <div>
          <button
            data-testid="leftArrow"
            className={
              page === 1
                ? 'arrowButton leftArrow disabledArrowButton'
                : 'arrowButton leftArrow'
            }
            type="button"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            <MemoLeftArrow aria-label="Left Arrow" width={40} height={40} />
          </button>
          <button
            data-testid="rightArrow"
            aria-label="Next page"
            className={
              page === limit + 1
                ? 'arrowButton rightArrow disabledArrowButton'
                : 'arrowButton rightArrow'
            }
            type="button"
            disabled={page === limit + 1}
            onClick={() => {
              const pageEl =
                document.querySelectorAll('.pageComponent')[page - 1];
              const errorEl = pageEl?.querySelectorAll('.errorContainer');
              const inputEl = pageEl?.querySelectorAll(
                'input[required], textarea[required], select[required]',
              );

              const findInputs: {
                mobile: any;
                email: any;
              } = {
                mobile: null,
                email: null,
              };

              inputEl?.forEach((el) => {
                if (el.getAttribute('name') === 'mobileNumber') {
                  findInputs.mobile = el;
                }
                if (el.getAttribute('type') === 'email') {
                  findInputs.email = el;
                }
              });

              if (
                pageEl &&
                inputEl &&
                InputValidationAll(inputEl, errorEl, false, businessData)
              ) {
                if (
                  findInputs.mobile &&
                  typeof verifiedPhone &&
                  !verifiedPhone &&
                  businessData?.phone_number
                ) {
                  openPhone(true);
                  sendVerificationCode(businessData.phone_number);
                } else if (findInputs.email && businessData?.email) {
                  if (typeof onEmailSubmit !== 'undefined') onEmailSubmit();
                } else {
                  setPage(page + 1);
                }
              }
            }}
          >
            <MemoRightArrow aria-label="Right Arrow" width={40} height={40} />
          </button>
        </div>
      </div>
    </footer>
  );
}
