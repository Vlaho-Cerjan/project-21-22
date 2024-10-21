'use client';

import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'res' implicitly has an 'any' type.
import {API} from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';
import React from 'react';
import {toast} from 'react-toastify';

const getDocumentation = async () => {
  const res = await ClientApiRequest({
    uri: 'api/documentation/openapi.yaml',
    auth: true,
    noRedirect: true,
  });

  console.log(res, 'doc res');

  return res;
};

export const DocumentationComponent = () => {
  const [documentation, setDocumentation] = React.useState<string | null>(null);
  const {setLoading} = React.useContext(LoadingContext);

  React.useEffect(() => {
    const fetchDocumentation = async () => {
      setLoading(true);
      const res = await getDocumentation();
      if (!res) {
        toast.error(`Failed to fetch documentation, ${res.message}`, {
          toastId: 'apiError',
        });
      } else {
        setDocumentation(res);
      }
      setLoading(false);
    };

    fetchDocumentation();

    return () => {
      setDocumentation(null);
    };
  }, []);

  return (
    <div>
      {(!documentation && (
        <div className="flexCenteredContainer">
          <h1>No Documentation Found</h1>
        </div>
      )) ||
        (documentation && (
          <div>
            <API
              layout="responsive"
              apiDescriptionDocument={documentation}
              router="memory"
            />
          </div>
        ))}
    </div>
  );
};
