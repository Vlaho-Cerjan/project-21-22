import {renderWithProviders} from '@/src/utils/testUtils';
import {screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Divider, {ModalDivider} from './divider';

describe('Divider component', () => {
  it('applies default className correctly', () => {
    renderWithProviders(<Divider />);
    expect(screen.getByRole('separator')).toHaveClass('divider');
  });

  it('merges provided className with default className', () => {
    const testClassName = 'test-class';
    renderWithProviders(<Divider className={testClassName} />);
    expect(screen.getByRole('separator')).toHaveClass(
      `divider ${testClassName}`,
    );
  });
});

describe('ModalDivider component', () => {
  it('applies default className correctly', () => {
    renderWithProviders(<ModalDivider />);
    expect(screen.getByRole('separator')).toHaveClass('divider modalDivider');
  });

  it('merges provided className with default and modalDivider classNames', () => {
    const testClassName = 'test-class';
    renderWithProviders(<ModalDivider className={testClassName} />);
    expect(screen.getByRole('separator')).toHaveClass(
      `divider modalDivider ${testClassName}`,
    );
  });
});
