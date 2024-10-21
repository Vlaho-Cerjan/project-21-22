import {useAppSelector} from '@/src/hooks';
import {Stringify} from '@/src/utils/Stringify';
import {render} from '@/test/utilities';
import {expect, it} from 'vitest';
import ReduxProvider from '../reduxProvider';

describe('ReduxProvider', () => {
  it('renders children without throwing an error', () => {
    const ReduxComponent = () => {
      const {
        view,
        enum: {enumData},
      } = useAppSelector((state) => state);

      return (
        <div>
          <div data-testid="view">{Stringify(view.view)}</div>
          <div data-testid="enum">{Stringify(enumData)}</div>
        </div>
      );
    };

    render(
      <ReduxProvider>
        <ReduxComponent />
      </ReduxProvider>,
    );

    const viewElement = document.querySelector('[data-testid="view"]');
    const enumElement = document.querySelector('[data-testid="enum"]');
    expect(viewElement).toBeInTheDocument();
    expect(enumElement).toBeInTheDocument();

    expect(viewElement?.textContent).toBe('"map"');
    expect(enumElement?.textContent).toBe('null');
  });
});
