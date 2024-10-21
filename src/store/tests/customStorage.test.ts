import {describe, expect, it} from 'vitest';
import {createNoopStorage} from '../customStorage';
/*
vi.mock('redux-persist/lib/storage/createWebStorage', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    getItem: vi.fn(() => Promise.resolve('mocked-value')),
    setItem: vi.fn(() => Promise.resolve('mocked-value')),
    removeItem: vi.fn(() => Promise.resolve()),
  })),
}));
*/
describe('storage', () => {
  let storage: any;
  let originalWindow: any;
  beforeEach(async () => {
    vi.resetModules(); // This is important to reset the module cache between tests
    originalWindow = global.window;
    storage = (await import('../customStorage')).default;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('should use createWebStorage if window is defined', async () => {
    if (typeof window !== 'undefined') {
      const key = 'test-key';
      const value = 'test-value';

      await storage.setItem(key, value);
      const storedValue = await storage.getItem(key);
      await storage.removeItem(key);
      const removedValue = await storage.getItem(key);

      expect(storedValue).toBe(value);
      expect(removedValue).toBeNull();
    }
  });

  it('should use createNoopStorage if window is undefined', async () => {
    delete (global as any).window;
    storage = (await import('../customStorage')).default;
    const key = 'test-key';
    const value = 'test-value';

    await storage.setItem(key, value);
    const storedValue = await storage.getItem(key);

    expect(storedValue).toBe(value);

    await storage.removeItem(key);
    const removedValue = await storage.getItem(key);

    expect(removedValue).toBeNull();

    // Restore window
    global.window = originalWindow;
  });

  it('createNoopStorage should return null for getItem', async () => {
    const noopStorage = createNoopStorage();
    const result = await noopStorage.getItem('test');
    expect(result).toBeNull();
  });

  it('createNoopStorage should resolve value for setItem', async () => {
    const noopStorage = createNoopStorage();
    const value = 'testValue';
    const result = await noopStorage.setItem('test', value);
    expect(result).toBe(value);
  });

  it('createNoopStorage should resolve for removeItem', async () => {
    const noopStorage = createNoopStorage();
    const result = await noopStorage.removeItem('test');
    expect(result).toBeUndefined();
  });
});
