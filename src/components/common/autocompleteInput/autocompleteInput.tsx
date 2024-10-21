/// <reference types="@types/google.maps" />

import {useEffect, useMemo, useRef} from 'react';
import {useScript} from 'usehooks-ts';

export default function AutoCompleteInput({
  children,
  inputRef,
  onChange,
  active,
}: {
  children: React.ReactNode;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (place: google.maps.places.PlaceResult) => void;
  active?: boolean;
}) {
  const scriptStatus = useScript(
    // By default, Google Places will attempt to guess your language based on your country.
    // However, you may specify it explicitly with the `language` parameter.
    `https://maps.googleapis.com/maps/api/js?language=en&key=${process.env.NEXT_PUBLIC_GMAPS_MAP_API_KEY}&loading=async&libraries=places`,
    {
      shouldPreventLoad: (typeof active !== 'undefined' && !active) || false,
      id: Math.random().toString(36).substring(7),
    },
  );

  const autoCompleteRef = useRef<google.maps.places.Autocomplete>();

  const options = useMemo(
    () => ({
      componentRestrictions: {country: ['us', 'ca', 'uk', 'au', 'nz']},
      fields: ['formatted_address', 'name', 'address_components', 'geometry'],
      //types: ['geocode', 'establishment'],
    }),
    [],
  );

  useEffect(() => {
    // Conditions to ensure that no multiple instances of the
    // Google Places API class and event listener exist.

    if (
      autoCompleteRef.current ||
      scriptStatus === 'loading' ||
      !inputRef.current ||
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places
    ) {
      return;
    }

    if (scriptStatus === 'error') {
      // Report error
      console.log(scriptStatus);
      return;
    }

    if (!inputRef.current) {
      console.log('inputRef.current is undefined');
      return;
    }

    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options,
    );

    autoCompleteRef.current.addListener('place_changed', () => {
      const place = autoCompleteRef?.current?.getPlace();

      if (typeof place?.address_components === 'undefined') {
        return;
      }

      // Retrieve the selected location with the `getPlace` method.
      onChange(
        autoCompleteRef?.current?.getPlace() as google.maps.places.PlaceResult,
      );
    });
  }, [scriptStatus, options, onChange]);

  return <div>{children}</div>;
}
