import {describe, expect, it} from 'vitest';
import {useSaveData} from '../saveData';

describe('useSaveData', () => {
  it('should return unsupported true if navigator or connection is not supported', () => {
    const {unsupported, saveData} = useSaveData();
    expect(unsupported).toBe(true);
    expect(saveData).toBeNull();
  });

  it('should return unsupported true if navigator.connection.saveData is not supported', () => {
    const originalNavigator = global.navigator;
    // @ts-expect-error delete navigator.connection
    global.navigator = {};
    const {unsupported, saveData} = useSaveData();
    global.navigator = originalNavigator;
    expect(unsupported).toBe(true);
    expect(saveData).toBeNull();
  });

  it('should return unsupported false and saveData true if navigator.connection.saveData is true', () => {
    const originalNavigator = global.navigator;
    global.navigator = {
      // @ts-expect-error delete navigator.connection
      connection: {
        saveData: true,
      },
    };
    const {unsupported, saveData} = useSaveData();
    global.navigator = originalNavigator;
    expect(unsupported).toBe(false);
    expect(saveData).toBe(true);
  });

  it('should return unsupported false and saveData false if navigator.connection.saveData is false', () => {
    const originalNavigator = global.navigator;
    global.navigator = {
      // @ts-expect-error delete navigator.connection
      connection: {
        saveData: false,
      },
    };
    const {unsupported, saveData} = useSaveData();
    global.navigator = originalNavigator;
    expect(unsupported).toBe(false);
    expect(saveData).toBe(false);
  });

  // Add more test cases to cover additional scenarios, if any
});
