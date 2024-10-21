import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import InlineModal from './inlineModal'; // Adjust the import path as necessary

describe('InlineModal component', () => {
  it('renders children correctly', () => {
    render(
      <InlineModal>
        <div data-testid="child">Test Child</div>
      </InlineModal>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Test Child');
  });

  it('applies provided ID correctly', () => {
    const testId = 'testModalId';
    render(
      <InlineModal data-testid="testModalId" id={testId}>
        <div>Test Content</div>
      </InlineModal>,
    );
    expect(screen.getByTestId('testModalId')).toHaveAttribute('id', testId);
  });

  it('applies provided className correctly', () => {
    const testClassName = 'testClassName';
    render(
      <InlineModal data-testid="testModalId" className={testClassName}>
        <div>Test Content</div>
      </InlineModal>,
    );
    expect(screen.getByTestId('testModalId')).toHaveClass(
      'inlineModal',
      testClassName,
    );
  });

  it('applies provided wrapperClassName correctly', () => {
    const testWrapperClassName = 'testWrapperClassName';
    render(
      <InlineModal wrapperClassName={testWrapperClassName}>
        <div>Test Content</div>
      </InlineModal>,
    );
    expect(screen.getByTestId('modalWrapper')).toHaveClass(
      'modalWrapper',
      testWrapperClassName,
    );
  });

  it('combines default and provided classNames correctly', () => {
    const testClassName = 'testClassName';
    const testWrapperClassName = 'testWrapperClassName';
    render(
      <InlineModal
        data-testid="testModalId"
        className={testClassName}
        wrapperClassName={testWrapperClassName}
      >
        <div>Test Content</div>
      </InlineModal>,
    );
    expect(screen.getByTestId('testModalId')).toHaveClass(
      'inlineModal',
      testClassName,
    );
    expect(screen.getByTestId('modalWrapper')).toHaveClass(
      'modalWrapper',
      testWrapperClassName,
    );
  });
});
