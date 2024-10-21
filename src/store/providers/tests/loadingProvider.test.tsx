import {renderWithProviders} from '@/src/utils/testUtils';
import {screen} from '@/test/utilities';
import React from 'react';
import {expect, it} from 'vitest';
import {LoadingContext} from '../loadingProvider';

describe('LoadingProvider', () => {
  it('should render the children', () => {
    renderWithProviders(<div>Test Children</div>);

    const childrenElement = screen.getByText('Test Children');
    expect(childrenElement).toBeInTheDocument();
  });

  it('should provide the loading state and setLoading function through context', () => {
    const TestComponent = () => {
      const {loading, setLoading} = React.useContext(LoadingContext);

      return (
        <div>
          <div data-testid="loadingText">
            {loading ? 'Loading' : 'Not Loading'}
          </div>
          <button type="button" onClick={() => setLoading(true)}>
            Set Loading
          </button>
        </div>
      );
    };

    renderWithProviders(<TestComponent />);

    const loadingStateElement = screen.getByTestId('loadingText');
    const setLoadingButton = screen.getByText('Set Loading');

    expect(loadingStateElement).toHaveTextContent('Not Loading');

    setLoadingButton.click();

    expect(loadingStateElement).toHaveTextContent('Loading');
  });
});
