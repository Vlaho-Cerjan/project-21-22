'use server';

import {useScript} from 'usehooks-ts';

export default async function GetScript({active}: {active?: boolean}) {
  const scriptStatus = useScript(
    // By default, Google Places will attempt to guess your language based on your country.
    // However, you may specify it explicitly with the `language` parameter.
    `https://maps.googleapis.com/maps/api/js?language=en&key=${process.env.GMAPS_MAP_API_KEY}&libraries=places`,
    {
      shouldPreventLoad: (typeof active !== 'undefined' && !active) || false,
    },
  );

  return scriptStatus;
}
