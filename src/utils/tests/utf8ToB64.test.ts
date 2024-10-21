import {describe, expect, it} from 'vitest';
import utf8ToB64 from '../utf8ToB64';

describe('utf8ToB64', () => {
  it('should correctly encode simple ASCII strings', () => {
    const result = utf8ToB64('hello');
    expect(result).toBe('aGVsbG8=');
  });

  it('should correctly encode an empty string', () => {
    const result = utf8ToB64('');
    expect(result).toBe('');
  });

  it('should handle strings with special characters', () => {
    const result = utf8ToB64('¡Hola! ¿Cómo estás?');
    expect(result).toBe('wqFIb2xhISDCv0PDs21vIGVzdMOhcz8=');
  });

  it('should handle strings with Unicode characters', () => {
    const result = utf8ToB64('こんにちは');
    expect(result).toBe('44GT44KT44Gr44Gh44Gv');
  });

  it('should handle strings with emojis', () => {
    const result = utf8ToB64('👋🌍');
    expect(result).toBe('8J+Ri/CfjI0=');
  });
});
