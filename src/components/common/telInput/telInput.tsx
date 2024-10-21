import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import type {Iti} from 'intl-tel-input';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.min.css';
import parsePhoneNumber from 'libphonenumber-js';
import React from 'react';

export const errorMap = [
  'Invalid number',
  'Invalid country code',
  'Too short',
  'Too long',
  'Invalid number',
];

const TelInput = ({
  country,
  data,
  setData,
  active,
  ...props
}: React.HTMLProps<HTMLInputElement> & {
  data: string;
  setData: (value: string) => void;
  active?: boolean;
  country?: string;
}) => {
  const phoneId = props.id || `phone${Math.random().toString(36).substring(7)}`;
  const [countryCode, setCountryCode] = React.useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [origData, setOrigData] = React.useState<string | null>(null);
  const [newCountrySelected, setNewCountrySelected] = React.useState(false);

  React.useEffect(() => {
    if (data && !origData) {
      setOrigData(data);
    }
  }, [data]);

  const handleChange = (input: HTMLInputElement, iti: Iti) => {
    const inputValue = input.value;
    const parsedNumber = parsePhoneNumber(inputValue);
    if (parsedNumber) {
      if (parsedNumber?.isValid()) {
        iti.setCountry(parsedNumber.country || '');
        setCountryCode(`+${parsedNumber.countryCallingCode}`);
        setPhoneNumber(parsedNumber.nationalNumber);
      } else if (parsedNumber.isPossible()) {
        const possibleCountries = parsedNumber.getPossibleCountries();
        if (possibleCountries && possibleCountries.length === 1) {
          iti.setCountry(possibleCountries[0] || '');
          setCountryCode(`+${parsedNumber.countryCallingCode}`);
          setPhoneNumber(parsedNumber.nationalNumber);
        }
      } else if (
        parsedNumber.countryCallingCode &&
        parsedNumber.nationalNumber
      ) {
        // iti.setCountry(parsedNumber.country || '');
        setCountryCode(`+${parsedNumber.countryCallingCode}`);
        setPhoneNumber(parsedNumber.nationalNumber);
      }
    } else {
      setPhoneNumber(inputValue);
    }
    setTimeout(() => {
      input.focus();
    }, 100);
  };

  useDidUpdateEffect(() => {
    setNewCountrySelected(false);
    if (!phoneNumber || !countryCode) {
      setData('');
      return;
    }
    setData(
      `${countryCode}${phoneNumber.replace(countryCode, '').replaceAll(' ', '')}`,
    );
  }, [phoneNumber, countryCode]);

  React.useEffect(() => {
    if (data && !phoneNumber) {
      const countryCodeData = countryCode?.replace('+', '');
      const countryCodes = [
        `+${countryCodeData}`,
        `00${countryCodeData}`,
        `+0${countryCodeData}`,
      ];
      const foundCode = {
        code: '',
      };
      countryCodes.forEach((code) => {
        if ((data as string).startsWith(code)) {
          foundCode.code = code;
        }
      });

      if (foundCode.code !== '') {
        setCountryCode(foundCode.code);
        setPhoneNumber(
          (data as string).replace(foundCode.code, '').replaceAll(' ', ''),
        );
      } else {
        const parsedNumber = parsePhoneNumber(data);
        if (parsedNumber) {
          setCountryCode(`+${parsedNumber.countryCallingCode}`);
          setPhoneNumber(parsedNumber.nationalNumber);
        }
      }
    }
  }, [data]);

  useDidUpdateEffect(() => {
    setNewCountrySelected(true);
  }, [country]);

  React.useEffect(() => {
    if (typeof active !== 'undefined' && !active) return;
    const input = document.getElementById(phoneId) as HTMLInputElement;
    if (!input) {
      return;
    }

    const newCountry: {
      country: string | undefined;
    } = {
      country: undefined,
    };

    const parsedNumber = parsePhoneNumber(data || '');
    if (
      parsedNumber &&
      parsedNumber.country?.toLowerCase() !== country?.toLowerCase()
    ) {
      newCountry.country = parsedNumber.country
        ? parsedNumber.country
        : country;
    }

    if (!newCountry.country) {
      newCountry.country = country;
    }

    if (newCountrySelected && !phoneNumber) {
      newCountry.country = country;
    }

    // initialize plugin
    const iti = intlTelInput(input as HTMLInputElement, {
      dropdownContainer: document.body,
      separateDialCode: true,
      formatOnDisplay: true,
      initialCountry: newCountry.country || 'us',
      // nationalMode: false,
      utilsScript: '/assets/js/utils.min.js',
    });

    if (newCountrySelected && !phoneNumber) {
      setCountryCode(`+${iti.getSelectedCountryData().dialCode}` || '');
    }

    input.addEventListener('countrychange', () => {
      if (iti.getSelectedCountryData().dialCode)
        setCountryCode(`+${iti.getSelectedCountryData().dialCode}` || '');
    });

    input.addEventListener('input', (e) => {
      handleChange(e.currentTarget as HTMLInputElement, iti);
    });

    // input.addEventListener('change', (e) => {
    //  handleChange(e.currentTarget as HTMLInputElement, iti);
    // });

    return () => {
      iti.destroy();
      input.removeEventListener('input', () => {});
      input.removeEventListener('countrychange', () => {});
    };
  }, [newCountrySelected, origData, active]);

  return (
    <div className="modalControl modalPhoneControl">
      <input
        ref={inputRef}
        type="tel"
        name="phone"
        {...props}
        value={phoneNumber || ''}
        id={phoneId}
      />
    </div>
  );
};

export default TelInput;
