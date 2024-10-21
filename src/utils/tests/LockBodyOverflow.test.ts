// LockBodyOverflow.test.ts
import {describe, expect, it, vi} from 'vitest';
import {LockBody} from '../LockBodyOverflow';

describe('Function that locks or unlocks the body overflow', () => {
  beforeAll(() => {
    // Mock window.scrollTo with a vi.fn() to ensure it does not throw
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });

    // Mock properties that don't exist in the vi environment
    Object.defineProperty(window, 'scrollY', {value: 0, writable: true});
  });

  beforeEach(() => {
    vi.resetAllMocks();
    // Reset the styles and mocked properties to their default state
    document.body.setAttribute('style', '');
    window.scrollTo(0, 0);
    window.scrollY = 0;
    vi.spyOn(document.body, 'scrollHeight', 'get').mockReturnValue(0);
  });

  it('should lock the body overflow', () => {
    const spy = vi.spyOn(document.body, 'setAttribute');

    LockBody(true);

    expect(spy).toHaveBeenCalledWith(
      'style',
      expect.stringContaining('overflow-y: hidden'),
    );
  });

  it('should unlock the body overflow', () => {
    // Lock the body first to ensure unlocking logic is tested
    LockBody(true);

    const spyRemove = vi.spyOn(document.body, 'removeAttribute');
    const spyScroll = vi.spyOn(window, 'scrollTo');

    LockBody(false);

    expect(spyRemove).toHaveBeenCalledWith('style');
    expect(spyScroll).toHaveBeenCalledWith(0, 0);
  });

  it('should set padding-right to 15px if body content is taller than the viewport', () => {
    vi.spyOn(document.body, 'scrollHeight', 'get').mockReturnValue(2000); // Simulate tall content
    Object.defineProperty(window, 'innerHeight', {value: 800}); // Simulate shorter viewport

    const spy = vi.spyOn(document.body, 'setAttribute');

    LockBody(true);

    expect(spy).toHaveBeenCalledWith(
      'style',
      expect.stringContaining('padding-right: 15px'),
    );
  });

  it('should not set padding-right if body content is not taller than the viewport', () => {
    vi.spyOn(document.body, 'scrollHeight', 'get').mockReturnValue(600); // Simulate short content
    Object.defineProperty(window, 'innerHeight', {value: 800}); // Simulate taller viewport

    const spy = vi.spyOn(document.body, 'setAttribute');

    LockBody(true);

    expect(spy).toHaveBeenCalledWith(
      'style',
      expect.not.stringContaining('padding-right: 15px'),
    );
  });

  // Example of a more dynamic test that adjusts based on viewport size
  it('if isItMobile is true, should set padding-right to account for scrollbar', () => {
    Object.defineProperty(window, 'innerWidth', {value: 320, writable: true}); // Simulate mobile viewport
    Object.defineProperty(document.body, 'clientWidth', {
      value: 320,
      writable: true,
    }); // Assume vertical scrollbar is present

    const spy = vi.spyOn(document.body, 'setAttribute');

    LockBody(true);

    // This assertion assumes the scrollbar width calculation is part of the LockBody logic
    expect(spy).toHaveBeenCalledWith(
      'style',
      expect.stringContaining('padding-right: calc(100vw - 100%)'),
    );
  });

  it('should restore the scroll position correctly when unlocking the body overflow', () => {
    // Set an initial scroll position
    Object.defineProperty(window, 'scrollY', {value: 100, writable: true});
    // Lock the body overflow to simulate setting the style with a negative top value
    LockBody(true);

    expect(document.body).toHaveStyle({top: '-100px'});
    // Additional check to ensure the scrollYValue calculation is correct
    // This line explicitly tests that the scroll position is restored correctly,
    // thus covering the line of code in question.
    const scrollYValue = parseInt(document.body.style.top || '0', 10) * -1;
    expect(scrollYValue).toStrictEqual(100);

    const spyScroll = vi.spyOn(window, 'scrollTo');
    // Unlock the body overflow
    LockBody(false);

    // Verify window.scrollTo is called with the correct scroll position,
    // indicating the scrollYValue calculation has been executed.
    expect(spyScroll).toHaveBeenCalledWith(0, scrollYValue);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
